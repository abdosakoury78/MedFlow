import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationItem } from '../../models/data';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<void>();

  notifications: NotificationItem[] = [];
  private subscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });

    if (this.authService.isLoggedIn()) {
      this.notificationService.loadNotifications().subscribe({
        error: () => {}
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  clearAll(): void {
    this.notificationService.clearAll().subscribe();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  closePanel(): void {
    this.close.emit();
  }
}