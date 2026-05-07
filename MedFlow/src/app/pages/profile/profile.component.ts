import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Doctor, DOCTORS } from '../../shared/models/data';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  doctor: Doctor = DOCTORS[0]; // replace with route param later

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    // Clear any authentication tokens or user data here
    // For this demo, we'll just navigate back to the login page
    this.router.navigate(['/login']);
  }
}
