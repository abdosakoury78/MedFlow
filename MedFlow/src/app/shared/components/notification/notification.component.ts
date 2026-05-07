import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  time: string;
  icon: string;
  read: boolean;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  @Output() close = new EventEmitter<void>();

  notifications: Notification[] = [
    {
      id: 1,
      title: 'New appointment booked with Dr. Sarah',
      time: '2 min ago',
      icon: 'fa-calendar-check',
      read: false
    },
    {
      id: 2,
      title: 'Appointment confirmed',
      time: '1 hour ago',
      icon: 'fa-circle-check',
      read: true
    },
    {
      id: 3,
      title: 'Reminder: Appointment tomorrow',
      time: '3 hours ago',
      icon: 'fa-bell',
      read: false
    }
  ];

  clearAll(): void {
    this.notifications = [];
  }

  closePanel(): void {
    this.close.emit();
  }
}