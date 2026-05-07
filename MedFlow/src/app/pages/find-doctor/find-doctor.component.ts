import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Doctor, DOCTORS, SPECIALTIES } from '../../shared/models/data';

@Component({
  selector: 'app-find-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './find-doctor.component.html',
  styleUrls: ['./find-doctor.component.css']
})
export class FindDoctorComponent {

  searchTerm: string = '';
  selectedSpecialty: string = 'All';


  specialties: string[] = SPECIALTIES;

  doctors: Doctor[] = DOCTORS;

  filteredDoctors: Doctor[] = [...this.doctors];

  constructor(private router: Router) {}

  filterDoctors() {
    this.filteredDoctors = this.doctors.filter(doc => {
      const matchSearch =
        doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchSpecialty =
        this.selectedSpecialty === 'All' ||
        doc.specialty === this.selectedSpecialty;

      return matchSearch && matchSpecialty;
    });
  }

  selectSpecialty(spec: string) {
    this.selectedSpecialty = spec;
    this.filterDoctors();
  }

  bookDoctor(id: number) {
    this.router.navigate(['/doctor', id]);
  }
}