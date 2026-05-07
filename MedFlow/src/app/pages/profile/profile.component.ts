import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Doctor } from '../../shared/models/data';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  doctor?: Doctor;
  loading = true;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const doctorId = this.authService.getUserId();
    if (!doctorId) { this.router.navigate(['/login']); return; }

    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (doc) => { this.doctor = doc; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  goBack() { this.router.navigate(['/dashboard']); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}