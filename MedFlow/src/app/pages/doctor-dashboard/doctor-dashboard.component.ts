import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { Doctor, Appointment } from '../../shared/models/data';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, NotificationComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {

  doctor?: Doctor;
  todayAppointments: Appointment[] = [];
  loading = true;
  showNotifications = false;

  stats: { title: string; value: any; icon: string }[] = [];

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const doctorId = this.authService.getUserId();
    if (!doctorId) return;

    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (doc) => {
        this.doctor = doc;
        this.loading = false;
        this.stats = [
          { title: 'Patients', value: doc.patientsCount, icon: 'fa-users' },
          { title: 'Reviews', value: doc.reviews, icon: 'fa-star' },
          { title: 'Experience', value: `${doc.experience} yrs`, icon: 'fa-briefcase' },
          { title: 'Rating', value: doc.rating, icon: 'fa-chart-line' }
        ];
      },
      error: () => { this.loading = false; }
    });

     this.appointmentService.getTodayAppointmentsForDoctor(doctorId).subscribe({
       next: (appts) => {
         this.todayAppointments = appts;
       },
       error: () => {}
     });

    this.notificationService.loadUnreadCount().subscribe({ error: () => {} });
  }

  get unreadCount$() {
    return this.notificationService.unreadCount$;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  goToProfile() {
    this.router.navigate(['/doctor-profile']);
  }
}