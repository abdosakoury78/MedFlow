import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { PatientService } from '../../services/patient.service';

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

  showPassword = false;
  showConfirmPassword = false;

  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(private router: Router, private patientService: PatientService) {}

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  onSignUp() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.showAlert('Please fill all fields', 'warning');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showAlert('Passwords do not match', 'error');
      return;
    }

    // Only patient self-registration is supported via this form.
    // Doctor accounts must be created by an admin via POST /api/doctors.
    const dto: any = {
      name: this.name,
      email: this.email,
      phone: '',
      location: '',
      age: 0,
      blood: '',
      gender: '',
      avatar: '👤'
    };

    this.patientService.createPatient(dto).subscribe({
      next: () => {
        this.showAlert('Account created successfully!', 'success');
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Registration failed. Email may already be in use.';
        this.showAlert(msg, 'error');
      }
    });
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;
  }
}