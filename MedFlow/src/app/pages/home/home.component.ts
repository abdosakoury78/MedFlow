import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Doctor, Appointment } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, NotificationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  doctors: Doctor[] = [];
  upcomingAppointments: Appointment[] = [];
  today = new Date();
  showNotifications = false;
  loading = true;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.doctorService.getOnlineDoctors().subscribe({
      next: (docs) => { this.doctors = docs; this.loading = false; },
      error: () => { this.loading = false; }
    });

    const patientId = this.authService.getUserId();
    if (patientId) {
      this.appointmentService.getUpcomingAppointments(patientId).subscribe({
        next: (appts) => this.upcomingAppointments = appts,
        error: () => {}
      });
    }
  }

  navigateToDoctor(id: number): void { this.router.navigate(['/doctor', id]); }
  navigateToProfile(): void { this.router.navigate(['/profile']); }
  goToAppointment(doctorId: number): void { this.router.navigate(['/doctor', doctorId]); }
  toggleNotifications(): void { this.showNotifications = !this.showNotifications; }
  closeNotifications(): void { this.showNotifications = false; }
}