import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { APPOINTMENT_HISTORY, Appointment } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent {
  appointmentHistory: Appointment[] = APPOINTMENT_HISTORY;

  patient = {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '+1(555) 234-8901',
    location: 'Portland, OR',
    age: 28,
    blood: 'O+',
    gender: 'F',
    avatar: '👩'
  };

  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}