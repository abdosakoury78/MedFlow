import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarUser, SIDEBAR_USER } from '../../models/data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  user: SidebarUser = SIDEBAR_USER;
  isDoctor: boolean = this.user.role === "Doctor"; // Set to true for testing, replace with real role check

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.clear(); // or remove token
    this.router.navigate(['/login']);
  }
}