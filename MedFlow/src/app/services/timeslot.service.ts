import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TimeSlot } from '../shared/models/data';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {

  private baseUrl = `${environment.apiUrl}/timeslots`;

  constructor(private http: HttpClient) {}

  // =====================
  // GET ALL SLOTS FOR DOCTOR + DATE
  // /api/timeslots/doctor/:id?date=YYYY-MM-DD
  // =====================
  getSlots(doctorId: number, date: string): Observable<TimeSlot[]> {
    const params = new HttpParams().set('date', date);

    return this.http.get<TimeSlot[]>(
      `${this.baseUrl}/doctor/${doctorId}`,
      { params }
    );
  }

  // =====================
  // GET AVAILABLE SLOTS ONLY
  // /api/timeslots/doctor/:id?date=YYYY-MM-DD&available=true
  // =====================
  getAvailableSlots(doctorId: number, date: string): Observable<TimeSlot[]> {
    const params = new HttpParams()
      .set('date', date)
      .set('available', 'true');

    return this.http.get<TimeSlot[]>(
      `${this.baseUrl}/doctor/${doctorId}`,
      { params }
    );
  }

  // =====================
  // BOOK SLOT
  // PATCH /api/timeslots/:id/book
  // =====================
  bookSlot(slotId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/${slotId}/book`,
      {}
    );
  }
}