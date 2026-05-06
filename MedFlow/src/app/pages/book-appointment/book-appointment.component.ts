import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCTORS, Doctor, TIME_SLOTS, TimeSlot } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, AlertComponent],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {

  doctor?: Doctor;

  timeSlots: TimeSlot[] = TIME_SLOTS;

  selectedSlot: string = '';
  selectedDay: number | null = null;

  currentDate = new Date();
  today = new Date();

  currentMonth = '';
  calendarDays: number[] = [];

  weekdays = ['MO','TU','WE','TH','FR','SA','SU'];

  confirmed = false;

  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'success';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctor = DOCTORS.find(d => d.id === id);

    this.generateCalendar();
  }

  /* ===== CALENDAR ===== */

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.currentMonth = this.currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // auto select today if same month
    if (
      this.today.getMonth() === month &&
      this.today.getFullYear() === year
    ) {
      this.selectedDay = this.today.getDate();
    } else {
      this.selectedDay = 1;
    }
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  prevMonth(): void {
    const today = new Date();

    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    // 🚫 Prevent going to past month
    if (
      currentYear < todayYear ||
      (currentYear === todayYear && currentMonth <= todayMonth)
    ) {
      return;
    }

    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  /* ===== HELPERS ===== */

  isPastDay(day: number): boolean {
    const date = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );

    const today = new Date(this.today);
    today.setHours(0,0,0,0);

    return date < today;
  }

  isPastMonth(): boolean {
    const today = new Date();

    return (
      this.currentDate.getFullYear() === today.getFullYear() &&
      this.currentDate.getMonth() === today.getMonth()
    );
  }

  /* ===== SELECTION ===== */

  selectDay(day: number) {
    if (this.isPastDay(day)) return;
    this.selectedDay = day;
  }

  selectSlot(slot: TimeSlot) {
    if (!slot.available) return;
    this.selectedSlot = slot.time;
  }

  /* ===== ACTIONS ===== */

  confirmBooking() {
    if (!this.selectedDay || !this.selectedSlot) {
      this.showAlert('Please select date and time first', 'warning');
      return;
    }

    this.confirmed = true;

    this.showAlert('Appointment booked successfully 🎉', 'success');

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }

  goBack() {
    this.router.navigate(['/doctor', this.doctor?.id]);
  }

  showAlert(message: string, type: any) {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    // auto hide after 3 sec
    setTimeout(() => {
      this.alertVisible = false;
    }, 3000);
  }

  onAlertClose() {
    this.alertVisible = false;
  }
}