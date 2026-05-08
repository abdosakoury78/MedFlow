import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarUser } from '../../models/data';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user: SidebarUser = { name: '', role: '' };
  isDoctor = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const authUser = this.authService.getUser();
    if (authUser) {
      this.user = { name: authUser.email, role: authUser.role };
      this.isDoctor = authUser.role === 'DOCTOR';
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get displayName(): string {
    return this.user.name.split('@')[0]; // Extract name from email
  }
}