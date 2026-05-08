import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Doctor } from '../../shared/models/data';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-find-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './find-doctor.component.html',
  styleUrls: ['./find-doctor.component.css']
})
export class FindDoctorComponent implements OnInit {

  searchTerm = '';
  selectedSpecialty = 'All';
  specialties: string[] = ['All'];
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  loading = true;

  constructor(private router: Router, private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getSpecialties().subscribe({
      next: (specs) => this.specialties = [...specs],
      error: () => {}
    });

    this.doctorService.getAllDoctors().subscribe({
      next: (docs) => {
        this.doctors = docs;
        this.filteredDoctors = docs;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterDoctors() {
    // Use backend search when searchTerm changes
    if (this.searchTerm.trim()) {
      this.doctorService.getAllDoctors(undefined, this.searchTerm).subscribe({
        next: (docs) => this.filteredDoctors = docs
      });
    } else {
      this.applyLocalFilter();
    }
  }

  selectSpecialty(spec: string) {
    this.selectedSpecialty = spec;
    if (spec === 'All') {
      this.doctorService.getAllDoctors().subscribe({ next: (docs) => this.filteredDoctors = docs });
    } else {
      this.doctorService.getAllDoctors(spec).subscribe({ next: (docs) => this.filteredDoctors = docs });
    }
  }

  private applyLocalFilter() {
    this.filteredDoctors = this.doctors.filter(doc => {
      const matchSpecialty = this.selectedSpecialty === 'All' || doc.specialty === this.selectedSpecialty;
      return matchSpecialty;
    });
  }

  bookDoctor(id: number) { this.router.navigate(['/doctor', id]); }
}