import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCTORS, Doctor } from '../../shared/models/data';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctor: Doctor | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctor = DOCTORS.find(d => d.id === id) ?? DOCTORS[0];
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  bookAppointment(): void {
    if (this.doctor) {
      this.router.navigate(['/book', this.doctor.id]);
    }
  }
}