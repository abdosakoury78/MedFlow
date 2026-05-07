import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient } from '../shared/models/data';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  // =====================
  // GET PATIENT BY EMAIL
  // /api/patients/email/:email
  // =====================
  getPatientByEmail(email: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/email/${email}`);
  }

  // =====================
  // GET PATIENT BY ID
  // /api/patients/:id
  // =====================
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  // =====================
  // CREATE PATIENT
  // POST /api/patients
  // =====================
  createPatient(dto: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, dto);
  }

  // =====================
  // UPDATE PATIENT
  // PUT /api/patients/:id
  // =====================
  updatePatient(id: number, dto: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/${id}`, dto);
  }
}