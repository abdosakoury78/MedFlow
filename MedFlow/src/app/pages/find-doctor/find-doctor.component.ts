import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

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

  specialties: string[] = [
    'All',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics'
  ];

  doctors = [
    { id: 1, name: 'Dr. Sarah Ahmed', specialty: 'Cardiology', rating: 4.8, experience: 10, fee: 50, avatar: '🫀' },
    { id: 2, name: 'Dr. John Smith', specialty: 'Dermatology', rating: 4.6, experience: 8, fee: 40, avatar: '🧴' },
    { id: 3, name: 'Dr. Emily Brown', specialty: 'Neurology', rating: 4.9, experience: 12, fee: 70, avatar: '🧠' },
    { id: 4, name: 'Dr. Ahmed Ali', specialty: 'Orthopedics', rating: 4.7, experience: 9, fee: 55, avatar: '🦴' },
    { id: 5, name: 'Dr. Lisa Green', specialty: 'Pediatrics', rating: 4.5, experience: 7, fee: 45, avatar: '👶' }
  ];

  filteredDoctors = [...this.doctors];

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