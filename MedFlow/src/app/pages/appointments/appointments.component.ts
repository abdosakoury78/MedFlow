import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { RouterLink } from '@angular/router';
import { Appointment } from '../../shared/models/data';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterLink],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  todayAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const patientId = this.authService.getUserId();
    if (!patientId) return;

    this.appointmentService.getTodayAppointments(patientId).subscribe({
      next: (appts) => { this.todayAppointments = appts; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.appointmentService.getUpcomingAppointments(patientId).subscribe({
      next: (appts) => this.upcomingAppointments = appts,
      error: () => {}
    });
  }

  cancel(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: () => {
        this.todayAppointments = this.todayAppointments.filter(a => a.id !== appointmentId);
        this.upcomingAppointments = this.upcomingAppointments.filter(a => a.id !== appointmentId);
      }
    });
  }
}