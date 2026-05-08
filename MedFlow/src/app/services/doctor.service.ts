import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, Doctor, DoctorSignupRequest, LoginCredentials } from '../shared/models/data';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private baseUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  // =====================
  // GET ALL DOCTORS
  // /api/doctors?specialty=&search=
  // =====================
  getAllDoctors(specialty?: string, search?: string): Observable<Doctor[]> {
    let params = new HttpParams();

    if (specialty && specialty !== 'All') {
      params = params.set('specialty', specialty);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Doctor[]>(this.baseUrl, { params });
  }

  // =====================
  // GET DOCTOR BY ID
  // /api/doctors/:id
  // =====================
  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  // =====================
  // GET SPECIALTIES
  // /api/doctors/specialties
  // =====================
  getSpecialties(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/specialties`);
  }

  // =====================
  // GET ONLINE DOCTORS
  // /api/doctors/online
  // =====================
  getOnlineDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/online`);
  }

  createDoctor(dto: DoctorSignupRequest): Observable<AuthResponse<Doctor>> {
    return this.http.post<AuthResponse<Doctor>>(`${this.baseUrl}/signup`, dto);
  }

  // =====================
  // LOGIN DOCTOR
  // POST /api/doctors/login
  // =====================
  loginDoctor(credentials: LoginCredentials): Observable<AuthResponse<Doctor>> {
    return this.http.post<AuthResponse<Doctor>>(`${this.baseUrl}/login`, credentials);
  }
}