import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Appointment, Patient } from '../../shared/models/data';
import { PatientService } from '../../services/patient.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {

  patient?: Patient;
  // edit state
  editMode = false;
  editPatient?: Patient;
  saving = false;
  saveMessage = '';
  private autoSaveTimer: any = null;
  private autoSaveDelay = 1000; // ms
  appointmentHistory: Appointment[] = [];
  loading = true;

  constructor(
    private router: Router,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const patientId = this.authService.getUserId();
    if (!patientId) { this.router.navigate(['/login']); return; }

    this.patientService.getPatientById(patientId).subscribe({
      next: (p) => { this.patient = p; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.appointmentService.getHistory(patientId).subscribe({
      next: (history) => this.appointmentHistory = history,
      error: () => {}
    });
  }

  toggleEdit(): void {
    if (!this.patient) { return; }
    this.editMode = !this.editMode;
    if (this.editMode) {
      // shallow clone for editing
      this.editPatient = { ...this.patient };
      this.saveMessage = '';
    } else {
      this.editPatient = undefined;
      this.clearAutoSaveTimer();
    }
  }

  onFieldChange(): void {
    // called from template (ngModelChange) to schedule auto-save
    this.scheduleAutoSave();
  }

  private scheduleAutoSave(): void {
    this.clearAutoSaveTimer();
    this.saveMessage = 'Unsaved changes';
    this.autoSaveTimer = setTimeout(() => this.performSave(), this.autoSaveDelay);
  }

  private clearAutoSaveTimer(): void {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  performSave(): void {
    if (!this.editPatient || !this.patient) { return; }
    this.saving = true;
    this.saveMessage = 'Saving...';

    this.patientService.updatePatient(this.patient.id as number, this.editPatient).subscribe({
      next: (updated) => {
        // update local model and UI
        this.patient = { ...updated };
        this.editPatient = { ...updated };
        this.saving = false;
        this.saveMessage = 'All changes saved';
        // hide message after short delay
        setTimeout(() => this.saveMessage = '', 1500);
      },
      error: () => {
        this.saving = false;
        this.saveMessage = 'Save failed';
      }
    });
  }

  cancelEdit(): void {
    // discard changes
    this.clearAutoSaveTimer();
    if (this.patient) { this.editPatient = { ...this.patient }; }
    this.editMode = false;
    this.saveMessage = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}