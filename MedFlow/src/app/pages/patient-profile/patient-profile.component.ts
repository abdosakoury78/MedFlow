import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Appointment, Patient } from '../../shared/models/data';
import { PatientService } from '../../services/patient.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {

  patient?: Patient;
  appointmentHistory: Appointment[] = [];
  loading = true;

  constructor(
    private router: Router,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const patientId = this.authService.getUserId();
    if (!patientId) { this.router.navigate(['/login']); return; }

    this.patientService.getPatientById(patientId).subscribe({
      next: (p) => { this.patient = p; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.appointmentService.getHistory(patientId).subscribe({
      next: (history) => this.appointmentHistory = history,
      error: () => {}
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}