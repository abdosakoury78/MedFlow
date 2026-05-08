import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { NotificationItem } from '../shared/models/data';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  private readonly notificationsSubject = new BehaviorSubject<NotificationItem[]>([]);
  private readonly unreadCountSubject = new BehaviorSubject<number>(0);

  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getCurrentRecipient(): { role: 'PATIENT' | 'DOCTOR'; recipientId: number } | null {
    const role = this.authService.getRole();
    const recipientId = this.authService.getUserId();

    if (!role || !recipientId) {
      return null;
    }

    // Convert role to uppercase to match backend expectations
    const upperRole = role.toUpperCase() as 'PATIENT' | 'DOCTOR';
    return { role: upperRole, recipientId };
  }

  loadNotifications(): Observable<NotificationItem[]> {
    const recipient = this.getCurrentRecipient();
    if (!recipient) {
      this.notificationsSubject.next([]);
      this.unreadCountSubject.next(0);
      return of([]);
    }

    return this.http
      .get<NotificationItem[]>(`${this.baseUrl}/recipient/${recipient.role}/${recipient.recipientId}`)
      .pipe(
        map((notifications) => notifications.map((notification) => this.toViewModel(notification))),
        tap((notifications) => {
          this.notificationsSubject.next(notifications);
          this.unreadCountSubject.next(notifications.filter((notification) => !notification.read).length);
        })
      );
  }

  loadUnreadCount(): Observable<number> {
    const recipient = this.getCurrentRecipient();
    if (!recipient) {
      this.unreadCountSubject.next(0);
      return of(0);
    }

    return this.http
      .get<number>(`${this.baseUrl}/recipient/${recipient.role}/${recipient.recipientId}/unread-count`)
      .pipe(tap((count) => this.unreadCountSubject.next(count)));
  }

  markAllAsRead(): Observable<NotificationItem[]> {
    const recipient = this.getCurrentRecipient();
    if (!recipient) {
      this.notificationsSubject.next([]);
      this.unreadCountSubject.next(0);
      return of([]);
    }

    return this.http
      .patch<NotificationItem[]>(`${this.baseUrl}/recipient/${recipient.role}/${recipient.recipientId}/read-all`, {})
      .pipe(
        map((notifications) => notifications.map((notification) => this.toViewModel(notification))),
        tap((notifications) => {
          this.notificationsSubject.next(notifications);
          this.unreadCountSubject.next(0);
        })
      );
  }

  clearAll(): Observable<void> {
    const recipient = this.getCurrentRecipient();
    if (!recipient) {
      this.notificationsSubject.next([]);
      this.unreadCountSubject.next(0);
      return of(void 0);
    }

    return this.http.delete<void>(`${this.baseUrl}/recipient/${recipient.role}/${recipient.recipientId}`).pipe(
      tap(() => {
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
      })
    );
  }

  private toViewModel(notification: NotificationItem): NotificationItem {
    return {
      ...notification,
      time: this.formatRelativeTime(notification.createdAt)
    };
  }

  private formatRelativeTime(createdAt: string): string {
    const parsedDate = new Date(createdAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Just now';
    }

    const diffMinutes = Math.max(0, Math.floor((Date.now() - parsedDate.getTime()) / 60000));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
}
