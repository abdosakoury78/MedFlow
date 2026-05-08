import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Doctor, TimeSlot, CreateAppointmentPayload } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { DoctorService } from '../../services/doctor.service';
import { TimeSlotService } from '../../services/timeslot.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, AlertComponent],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {

  doctor?: Doctor;
  timeSlots: TimeSlot[] = [];

  selectedSlot?: TimeSlot = undefined;
  selectedDay: number = 1;

  currentDate = new Date();
  today = new Date();
  currentMonth = '';
  calendarDays: number[] = [];
  weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  confirmed = false;
  loading = false;
  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private timeSlotService: TimeSlotService,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctorService.getDoctorById(id).subscribe({
      next: (doc) => { this.doctor = doc;
        this.generateCalendar(); // calendar depends on doctor screen
      this.setTodayAsSelected(); // 👈 ADD THIS
       },
      error: () => this.showAlert('Doctor not found', 'error')
    });
    this.generateCalendar();
  }
setTodayAsSelected() {
  const now = new Date();

  const isCurrentMonth =
    this.currentDate.getFullYear() === now.getFullYear() &&
    this.currentDate.getMonth() === now.getMonth();

  if (isCurrentMonth) {
    this.selectedDay = now.getDate();
  } else {
    this.selectedDay = 1;
  }

  this.loadSlots();
}
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    if (this.today.getMonth() === month && this.today.getFullYear() === year) {
      this.selectedDay = this.today.getDate();
    } else {
      this.selectedDay = 1;
    }
    this.loadSlots();
  }

  loadSlots() {
    if (!this.doctor || !this.selectedDay) return;

    const date = this.getSelectedDateStr();

    this.timeSlotService.getAvailableSlots(this.doctor.id, date).subscribe({
      next: (slots) => {

        const now = new Date();
        const isToday =
          now.getFullYear() === this.currentDate.getFullYear() &&
          now.getMonth() === this.currentDate.getMonth() &&
          now.getDate() === this.selectedDay;

        this.timeSlots = slots.map(slot => {

          if (!isToday) {
            return slot; // all slots are fine for future days
          }

          // convert slot time → comparable Date
          const [time, modifier] = slot.time.split(' ');
          let [hours, minutes] = time.split(':').map(Number);

          if (modifier === 'PM' && hours !== 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;

          const slotDate = new Date();
          slotDate.setHours(hours, minutes || 0, 0, 0);

          // if slot is in the past → mark unavailable
          return {
            ...slot,
            available: slot.available && slotDate > now
          };
        });

      },
      error: () => this.timeSlots = []
    });
  }

  getSelectedDateStr(): string {
    const year = this.currentDate.getFullYear();
    const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(this.selectedDay).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  prevMonth() {
    const today = new Date();
    if (
      this.currentDate.getFullYear() < today.getFullYear() ||
      (this.currentDate.getFullYear() === today.getFullYear() && this.currentDate.getMonth() <= today.getMonth())
    ) return;
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  isPastDay(day: number): boolean {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    const t = new Date(this.today);
    t.setHours(0, 0, 0, 0);
    return date < t;
  }

  isPastMonth(): boolean {
    const today = new Date();
    return this.currentDate.getFullYear() === today.getFullYear() &&
      this.currentDate.getMonth() === today.getMonth();
  }

  selectDay(day: number) {
    if (this.isPastDay(day)) return;
    this.selectedDay = day;
    this.selectedSlot = undefined;
    this.loadSlots();
  }

  selectSlot(slot: TimeSlot) {
    if (!slot.available) return;
    this.selectedSlot = slot;
  }

  confirmBooking() {
    if (!this.selectedDay || !this.selectedSlot) {
      this.showAlert('Please select date and time first', 'warning');
      return;
    }

    const patientId = this.authService.getUserId();
    if (!patientId) {
      this.showAlert('Please log in first', 'error');
      return;
    }

    this.loading = true;

    const payload: CreateAppointmentPayload = {
      doctorId: this.doctor!.id,
      patientId: patientId,
      appointmentDate: this.getSelectedDateStr(),
      appointmentTime: this.selectedSlot.time,
      duration: 30
    };

    this.appointmentService.createAppointment(payload).subscribe({
      next: () => {
        // Also mark the time slot as booked
        this.timeSlotService.bookSlot(this.selectedSlot!.id).subscribe();
        this.confirmed = true;
        this.loading = false;
        this.showAlert('Appointment booked successfully 🎉', 'success');
        setTimeout(() => this.router.navigate(['/home']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.showAlert(err?.error?.message || 'Booking failed. Try again.', 'error');
      }
    });
  }

  goBack() { this.router.navigate(['/doctor', this.doctor?.id]); }

  showAlert(message: string, type: any) {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;
    setTimeout(() => { this.alertVisible = false; }, 3000);
  }

  onAlertClose() { this.alertVisible = false; }
}