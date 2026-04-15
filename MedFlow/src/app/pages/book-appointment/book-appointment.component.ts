import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCTORS, Doctor, TIME_SLOTS, TimeSlot } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

interface CalendarDay {
  day: number | null;
  hasSlot?: boolean;
  isWeekend?: boolean;
}

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  doctor: Doctor | undefined;
  timeSlots: TimeSlot[] = TIME_SLOTS;
  selectedSlot: string = '11:00 AM';
  selectedDay: number = 9;
  currentMonth: string = 'OCTOBER 2024';
  confirmed: boolean = false;

  weekdays: string[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  calendarDays: CalendarDay[] = [
    { day: 30, isWeekend: false }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5, isWeekend: true }, { day: 6, isWeekend: true },
    { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11, hasSlot: true }, { day: 12, isWeekend: true }, { day: 13, isWeekend: true },
    { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18, hasSlot: true }, { day: 19, isWeekend: true }, { day: 20, isWeekend: true }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctor = DOCTORS.find(d => d.id === id) ?? DOCTORS[0];
  }

  selectDay(day: number | null): void {
    if (day && day !== 30) {
      this.selectedDay = day;
    }
  }

  selectSlot(slot: TimeSlot): void {
    if (slot.available) {
      this.selectedSlot = slot.time;
    }
  }

  confirmBooking(): void {
    this.confirmed = true;
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/doctor', this.doctor?.id]);
  }
}