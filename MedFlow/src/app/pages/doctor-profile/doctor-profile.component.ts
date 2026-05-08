import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Doctor } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { DoctorProfileUpdateRequest } from '../../shared/models/data';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {

  doctor?: Doctor;
  loading = true;
  error = false;
  // edit state
  editMode = false;
  editDoctor?: Doctor;
  saving = false;
  saveMessage = '';
  private autoSaveTimer: any = null;
  private autoSaveDelay = 1000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // try route param first; if missing, fall back to logged-in user id
    let id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      const authId = this.authService.getUserId();
      if (authId) { id = authId; }
    }

    if (!id || isNaN(id)) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.doctorService.getDoctorById(id).subscribe({
      next: (doc) => { this.doctor = doc; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  goBack(): void { this.router.navigate(['/home']); }

  bookAppointment(): void {
    if (this.doctor) this.router.navigate(['/book', this.doctor.id]);
  }

  toggleEdit(): void {
    if (!this.doctor) { return; }
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editDoctor = { ...this.doctor };
      this.saveMessage = '';
    } else {
      this.editDoctor = undefined;
      this.clearAutoSaveTimer();
    }
  }

  onFieldChange(): void {
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

  private buildUpdatePayload(): DoctorProfileUpdateRequest {
    return {
      name: this.editDoctor?.name,
      specialty: this.editDoctor?.specialty,
      experience: this.editDoctor?.experience,
      avatar: this.editDoctor?.avatar,
      bio: this.editDoctor?.bio,
      consultationFee: this.editDoctor?.consultationFee,
      online: this.editDoctor?.online,
      specialtyTags: this.editDoctor?.specialties,
      workingHours: this.editDoctor?.workingHours,
    };
  }

  saveAndClose(): void {
    if (!this.editMode) {
      this.toggleEdit();
      return;
    }
    this.performSave(true);
  }

  performSave(closeAfterSave = false): void {
    if (!this.editDoctor || !this.doctor) { return; }
    this.saving = true;
    this.saveMessage = 'Saving...';

    this.doctorService.updateDoctor(this.doctor.id as number, this.buildUpdatePayload()).subscribe({
      next: (updated) => {
        this.doctor = { ...updated };
        this.editDoctor = { ...updated };
        this.saving = false;
        this.saveMessage = 'All changes saved';
        if (closeAfterSave) {
          this.editMode = false;
          this.editDoctor = undefined;
        }
        setTimeout(() => this.saveMessage = '', 1500);
      },
      error: () => {
        this.saving = false;
        this.saveMessage = 'Save failed';
      }
    });
  }

  cancelEdit(): void {
    this.clearAutoSaveTimer();
    if (this.doctor) { this.editDoctor = { ...this.doctor }; }
    this.editMode = false;
    this.saveMessage = '';
  }
}