import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

import {
  DOCTORS,
  TODAY_APPOINTMENTS,
  Doctor,
  TodayAppointment,
  DOCTOR_APPOINTMENTS
} from '../../shared/models/data';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent {

  doctor: Doctor = DOCTORS[0];

  doctorAppointments = DOCTOR_APPOINTMENTS;

  stats = [
    {
      title: 'Patients',
      value: this.doctor.patientsCount,
      icon: 'fa-users'
    },
    {
      title: 'Reviews',
      value: this.doctor.reviews,
      icon: 'fa-star'
    },
    {
      title: 'Experience',
      value: `${this.doctor.experience} yrs`,
      icon: 'fa-briefcase'
    },
    {
      title: 'Rating',
      value: this.doctor.rating,
      icon: 'fa-chart-line'
    }
  ];

}