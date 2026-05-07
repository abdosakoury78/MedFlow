import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent {

  searchText: string = '';

  selectedPatient: any = null;

  activePatients = 12;
  newPatients = 3;

  patients = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@gmail.com',
      phone: '+1 234 567',
      location: 'Cairo',
      age: 28,
      blood: 'O+',
      gender: 'F',
      avatar: '👩'
    },
    {
      name: 'Omar Khaled',
      email: 'omar@gmail.com',
      phone: '+1 555 111',
      location: 'Giza',
      age: 35,
      blood: 'A+',
      gender: 'M',
      avatar: '🧑'
    },
    {
      name: 'Mona Adel',
      email: 'mona@gmail.com',
      phone: '+1 777 222',
      location: 'Alex',
      age: 30,
      blood: 'B+',
      gender: 'F',
      avatar: '👩'
    }
  ];

  filteredPatients() {
    return this.patients.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectPatient(p: any) {
    this.selectedPatient = p;
  }
}