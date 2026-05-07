import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  // 🔔 Alert system
  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 3000);
  }

  onSignIn(): void {

    if (!this.email || !this.password) {
      this.showAlert('Please enter email and password', 'warning');
      return;
    }

    // fake validation (replace later with backend)
     if (this.email === 'khalid@test.com' && this.password === '1234567') {
      this.showAlert('Login successful!', 'success');

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);

    } else {
      this.showAlert('Invalid email or password', 'error');
    }

    if (this.email === 'admin@test.com' && this.password === '123456') {
      this.showAlert('Login successful!', 'success');

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);

    } else {
      this.showAlert('Invalid email or password', 'error');
    }
  }
}