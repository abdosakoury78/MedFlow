import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment, CreateAppointmentPayload } from '../shared/models/data';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  // =====================
  // TODAY APPOINTMENTS
  // GET /api/appointments/patient/:id/today
  // =====================
  getTodayAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${this.baseUrl}/patient/${patientId}/today`
    );
  }

  // =====================
  // TODAY APPOINTMENTS FOR DOCTOR
  // GET /api/appointments/doctor/:id/today
  // =====================
  getTodayAppointmentsForDoctor(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${this.baseUrl}/doctor/${doctorId}/today`
    );
  }

  // =====================
  // UPCOMING APPOINTMENTS
  // GET /api/appointments/patient/:id/upcoming
  // =====================
  getUpcomingAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${this.baseUrl}/patient/${patientId}/upcoming`
    );
  }

  // =====================
  // HISTORY
  // GET /api/appointments/patient/:id/history
  // =====================
  getHistory(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${this.baseUrl}/patient/${patientId}/history`
    );
  }

  // =====================
  // CREATE APPOINTMENT
  // POST /api/appointments
  // =====================
  createAppointment(dto: CreateAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, dto);
  }

  // =====================
  // CANCEL APPOINTMENT
  // PATCH /api/appointments/:id/cancel
  // =====================
  cancelAppointment(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.baseUrl}/${id}/cancel`, {});
  }
}