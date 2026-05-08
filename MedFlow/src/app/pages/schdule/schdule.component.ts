import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Appointment, Patient } from '../../shared/models/data';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { PatientService } from '../../services/patient.service';

// NOTE: The backend appointments endpoints are /patient/{id}/...
// For a doctor schedule, a new endpoint GET /api/appointments/doctor/{doctorId} is needed.
// This component uses a workaround: it reads from the doctor's own ID treated as patient for now.
// Add the doctor-specific endpoint to the backend and update this once done.

@Component({
  selector: 'app-schdule',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, CommonModule, FormsModule],
  templateUrl: './schdule.component.html',
  styleUrl: './schdule.component.css'
})
export class SchduleComponent implements OnInit {

  activeTab: 'today' | 'upcoming' | 'history' = 'today';
  todayAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  historyAppointments: Appointment[] = [];
  loading = true;
  patientIds: number[] = [];
  patients : Patient[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const doctorId = this.authService.getUserId();
    if (!doctorId) return;

    // Using patientId endpoints as placeholder — add /doctor/{id} endpoints on backend
    this.appointmentService.getTodayAppointments(doctorId).subscribe({
      next: (a) => { this.todayAppointments = a; this.loading = false;
                this.patientIds = Array.from(new Set([...this.patientIds, ...a.map(app => app.patientId)]));
       },
      error: () => { this.loading = false; }
    });
    this.appointmentService.getUpcomingAppointments(doctorId).subscribe({
      next: (a) => {this.upcomingAppointments = a; console.log('Upcoming appointments:', a); 
        this.patientIds = Array.from(new Set([...this.patientIds, ...a.map(app => app.patientId)]));

        for (const id of this.patientIds) {
          this.patientService.getPatientById(id).subscribe({
            next: (p) => {
              this.patients.push(p);
            }
          })
        }
        console.log('Patients for upcoming appointments:', this.patients);
      },
      error: () => {}
      
    });
    this.appointmentService.getHistory(doctorId).subscribe({
      next: (a) => {this.historyAppointments = a
                this.patientIds = Array.from(new Set([...this.patientIds, ...a.map(app => app.patientId)]));
      },
      error: () => {}
    });
  }

  setTab(tab: 'today' | 'upcoming' | 'history') { this.activeTab = tab; }

  getPatient(id: number): Patient | undefined {
    return this.patients.find(p => p.id === id);
  }
}