import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-schdule',
  imports: [NavbarComponent, SidebarComponent, CommonModule, FormsModule],
  templateUrl: './schdule.component.html',
  styleUrl: './schdule.component.css'
})
export class SchduleComponent {
  activeTab: 'today' | 'upcoming' | 'history' = 'today';

  setTab(tab: 'today' | 'upcoming' | 'history') {
    this.activeTab = tab;
  }

  // TODAY (patients)
  todayAppointments = [
    {
      patient: 'Sarah Johnson',
      specialty: 'Cardiology',
      time: '10:30 AM',
      clinic: 'Heart Care Center',
      avatar: '👩',
      status: 'completed'
    },
    {
      patient: 'Omar Khaled',
      specialty: 'Dermatology',
      time: '12:00 PM',
      clinic: 'Skin Clinic',
      avatar: '🧑',
      status: 'upcoming'
    }
  ];

  // UPCOMING
  upcomingAppointments = [
    {
      patient: 'Mona Adel',
      specialty: 'Neurology',
      date: '12 May',
      time: '3:00 PM',
      avatar: '🧠'
    }
  ];

}
