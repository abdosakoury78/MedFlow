import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { RouterLink } from "@angular/router";
import { TodayAppointment, TODAY_APPOINTMENTS, ScheduledAppointment, SCHEDULED_APPOINTMENTS } from '../../shared/models/data';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterLink],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent {

  todayAppointments: TodayAppointment[] = TODAY_APPOINTMENTS;

  upcomingAppointments: ScheduledAppointment[] = SCHEDULED_APPOINTMENTS;

}