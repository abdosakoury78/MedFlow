import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'appointments',
    loadComponent() {
      return import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent);
    },
  },
  {
    path: 'doctors',
    loadComponent: () =>
      import('./pages/find-doctor/find-doctor.component').then(m => m.FindDoctorComponent)
  },
  {
    path: 'doctor/:id',
    loadComponent: () =>
      import('./pages/doctor-profile/doctor-profile.component').then(m => m.DoctorProfileComponent)
  },
  {
    path: 'book/:id',
    loadComponent: () =>
      import('./pages/book-appointment/book-appointment.component').then(m => m.BookAppointmentComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/patient-profile/patient-profile.component').then(m => m.PatientProfileComponent)
  },
  { path: '**', redirectTo: 'login' }
];