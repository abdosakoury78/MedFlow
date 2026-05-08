import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Doctor, Appointment, Patient } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarComponent, NotificationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  doctors: Doctor[] = [];
  upcomingAppointments: Appointment[] = [];
  patient?: Patient;
  today = new Date();
  showNotifications = false;
  loading = true;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (userId) {
      this.patientService.getPatientById(userId).subscribe({
        next: (p) => { this.patient = p; },
        error: () => {}
      });

      this.appointmentService.getUpcomingAppointments(userId).subscribe({
        next: (appts) => {

          this.upcomingAppointments = appts
            .sort((a, b) =>
              new Date(a.appointmentTime).getTime() -
              new Date(b.appointmentTime).getTime()
            )
            .slice(0, 3);

        },
        error: () => {}
      });

      this.notificationService.loadUnreadCount().subscribe({ error: () => {} });
    }

    this.doctorService.getOnlineDoctors().subscribe({
      next: (docs) => { this.doctors = docs; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get unreadCount$() {
    return this.notificationService.unreadCount$;
  }

  navigateToDoctor(id: number): void { this.router.navigate(['/doctor', id]); }
  navigateToProfile(): void { this.router.navigate(['/profile']); }
  toggleNotifications(): void { this.showNotifications = !this.showNotifications; }
  closeNotifications(): void { this.showNotifications = false; }
}