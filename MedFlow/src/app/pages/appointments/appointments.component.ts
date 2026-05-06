import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterLink],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent {

  todayAppointments = [
    {
      doctor: 'Dr. Sarah Ahmed',
      specialty: 'Cardiologist',
      time: '10:30 AM',
      duration: 30,
      clinic: 'Heart Care Center',
      avatar: '❤️',
      status: 'completed'
    },
    {
      doctor: 'Dr. Omar Khaled',
      specialty: 'Dermatologist',
      time: '12:00 PM',
      duration: 20,
      clinic: 'Skin Clinic',
      avatar: '🧑‍⚕️',
      status: 'upcoming'
    }
  ];

  upcomingAppointments = [
    {
      doctor: 'Dr. Mona Adel',
      specialty: 'Neurologist',
      date: '12 May',
      time: '3:00 PM',
      clinic: 'Brain Health Center',
      avatar: '🧠'
    },
    {
      doctor: 'Dr. Ahmed Nasser',
      specialty: 'Orthopedic',
      date: '15 May',
      time: '11:00 AM',
      clinic: 'Bone Care Clinic',
      avatar: '🦴'
    }
  ];

}