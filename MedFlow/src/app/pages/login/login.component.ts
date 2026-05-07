import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  showPassword = false;
  selectedRole: 'PATIENT' | 'DOCTOR' = 'PATIENT';

  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(
    private router: Router,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  togglePassword() { this.showPassword = !this.showPassword; }

  showAlert(message: string, type: any) {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;
    setTimeout(() => (this.alertVisible = false), 3000);
  }

  onSignIn(): void {
    if (!this.email || !this.password) {
      this.showAlert('Please enter email and password', 'warning');
      return;
    }

    if (this.selectedRole === 'PATIENT') {
      this.patientService.getPatientByEmail(this.email).subscribe({
        next: (user) => {
          this.authService.setUser({ id: user.id, email: user.email, role: 'PATIENT' });
          this.showAlert('Login successful!', 'success');
          setTimeout(() => this.router.navigate(['/home']), 1000);
        },
        error: () => this.showAlert('Patient not found', 'error')
      });
    } else {
      // Doctor login: search by email via getAllDoctors + search
      this.doctorService.getAllDoctors(undefined, this.email).subscribe({
        next: (doctors) => {
          const doctor = doctors.find(d => d.name.toLowerCase().includes(this.email.split('@')[0].toLowerCase()));
          if (doctor) {
            this.authService.setUser({ id: doctor.id, email: this.email, role: 'DOCTOR' });
            this.showAlert('Login successful!', 'success');
            setTimeout(() => this.router.navigate(['/dashboard']), 1000);
          } else {
            this.showAlert('Doctor account not found', 'error');
          }
        },
        error: () => this.showAlert('Login failed', 'error')
      });
    }
  }
}