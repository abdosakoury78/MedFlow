import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DOCTORS, Doctor } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  doctors: Doctor[] = DOCTORS;

  upcomingAppointments = [
    { doctor: 'Dr. Sarah Jenkins', specialty: 'Cardiology', time: '09:30 AM', avatar: '👩‍⚕️', id: 2 },
    { doctor: 'Dr. Michael Chen', specialty: 'General Health', time: '02:15 PM', avatar: '🧑‍⚕️', id: 3 }
  ];

  dailyInsight = {
    label: 'DAILY INSIGHT',
    title: 'Hydration increases cognitive focus by 14%',
    body: 'Remember to drink at least 2 liters of water today for optimal mental performance.',
    emoji: '💧'
  };

  constructor(private router: Router) {}

  navigateToDoctor(id: number): void {
    this.router.navigate(['/doctor', id]);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}