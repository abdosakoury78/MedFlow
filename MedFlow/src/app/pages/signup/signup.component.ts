import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { PatientService } from '../../services/patient.service';
import { DoctorService } from '../../services/doctor.service';
import { HttpClient } from '@angular/common/http';
import { Doctor } from '../../shared/models/data';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, AlertComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'patient';
  step: 1 | 2 = 1;

  // Step1 state (basic info)
  step1 = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  } as any;

  // Step2 state (role-specific)
  patientForm: any = {
    phone: '',
    location: '',
    age: null,
    blood: '',
    gender: '',
    avatar: 'assets/avatars/doctor-boy.png' // will hold uploaded URL
  };

  doctorForm: any = {
    specialty: '',
    experience: null,
    consultationFee: null,
    bio: '',
    isOnline: true,
    specialtyTags: [] as string[],
    tagInput: '',
    workingHours: [] as Array<{ days: string; hours: string }>,
    avatar: 'assets/avatars/doctor-boy.png' // will hold uploaded URL
  };

  avatarUploading = false;

  showPassword = false;
  showConfirmPassword = false;

  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(
    private router: Router,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private http: HttpClient
  ) { }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }
  onNextStep() {
    // validate basic info
    if (!this.step1.name || !this.step1.email || !this.step1.password || !this.step1.confirmPassword) {
      this.showAlert('Please fill all fields', 'warning');
      return;
    }
    if (this.step1.password !== this.step1.confirmPassword) {
      this.showAlert('Passwords do not match', 'error');
      return;
    }
    this.role = this.step1.role;
    this.step = 2;
  }

  onBackToStep1() {
    this.step = 1;
  }

  // Handle avatar upload immediately when file selected
  onAvatarSelected(event: any, forDoctor = false) {
    const file: File = event.target.files && event.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    this.avatarUploading = true;
    this.http.post<{ url: string }>(`${environment.apiUrl}/upload/avatar`, form).subscribe({
      next: (res) => {
        const url = res?.url;
        if (forDoctor) this.doctorForm.avatar = url;
        else this.patientForm.avatar = url;
        this.avatarUploading = false;
      },
      error: () => {
        this.avatarUploading = false;
        this.showAlert('Avatar upload failed', 'error');
      }
    });
  }

  addSpecialtyTag() {
    const v = (this.doctorForm.tagInput || '').trim();
    if (!v) return;

    v.split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .forEach((tag: string) => {
        if (!this.doctorForm.specialtyTags.includes(tag)) {
          this.doctorForm.specialtyTags.push(tag);
        }
      });

    this.doctorForm.tagInput = '';
  }

  removeSpecialtyTag(i: number) { this.doctorForm.specialtyTags.splice(i, 1); }

  addWorkingHour() {
    this.doctorForm.workingHours.push({ days: '', hours: '' });
  }

  removeWorkingHour(i: number) { this.doctorForm.workingHours.splice(i, 1); }

  submitStep2() {
    if (this.step1.role === 'patient') {
      const payload: any = {
        name: this.step1.name,
        email: this.step1.email,
        phone: this.patientForm.phone || '',
        location: this.patientForm.location || '',
        age: this.patientForm.age || 0,
        blood: this.patientForm.blood || '',
        gender: this.patientForm.gender || '',
        avatar: this.patientForm.avatar || null
      };
      this.patientService.createPatient(payload).subscribe({
        next: () => {
          this.showAlert('Account created successfully!', 'success');
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Registration failed. Email may already be in use.';
          this.showAlert(msg, 'error');
        }
      });
    } else {
      const payload: any = {
        name: this.step1.name,
        email: this.step1.email,
        specialty: this.doctorForm.specialty || '',
        experience: this.doctorForm.experience || 0,
        consultationFee: this.doctorForm.consultationFee || 0,
        bio: this.doctorForm.bio || '',
        isOnline: !!this.doctorForm.isOnline,
        avatar: this.doctorForm.avatar,

        rating: 0,
        reviews: 0,
        patientsCount: 0,

        specialtyTags: this.doctorForm.specialtyTags || [],
        workingHours: this.doctorForm.workingHours || []
      };
      this.doctorService.createDoctor(payload).subscribe({
        next: () => {
          this.showAlert('Doctor account created successfully!', 'success');
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Registration failed. Email may already be in use.';
          this.showAlert(msg, 'error');
        }
      });
    }
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;
  }

  selectDoctorAvatar(avatar: string) {
    this.doctorForm.avatar = avatar;
  }

  selectPatientAvatar(avatar: string) {
    this.patientForm.avatar = avatar;
  }
}