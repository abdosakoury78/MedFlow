import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCTORS, Doctor, UPCOMING_APPOINTMENTS, UpcomingAppointment } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, NotificationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  doctors: Doctor[] = DOCTORS;

  today = new Date();

  upcomingAppointments: UpcomingAppointment[] = UPCOMING_APPOINTMENTS;

  constructor(private router: Router) {}

  navigateToDoctor(id: number): void {
    this.router.navigate(['/doctor', id]);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToAppointment(doctorId: number): void {
    this.router.navigate(['/doctor', doctorId]);
  }

  showNotifications = false;

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }
}