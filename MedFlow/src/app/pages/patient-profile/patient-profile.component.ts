import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

import { APPOINTMENT_HISTORY, Appointment, CURRENT_PATIENT, Patient } from '../../shared/models/data';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent {

  appointmentHistory: Appointment[] = APPOINTMENT_HISTORY;

  patient: Patient = CURRENT_PATIENT;

  constructor(private router: Router) {}

  logout(): void {
    // later you can clear token here
    this.router.navigate(['/login']);
  }
}