import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Patient } from '../../shared/models/data';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  searchText = '';
  selectedPatient?: Patient;
  patients: Patient[] = [];
  loading = true;

  // NOTE: Backend needs GET /api/patients or GET /api/patients/doctor/{doctorId}
  // Currently PatientService only supports getById and getByEmail.
  // This component fetches patients by ID range as a placeholder.
  // Add a proper endpoint when ready.

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {

    const requests = Array.from({ length: 5 }, (_, i) =>
      this.patientService.getPatientById(i + 1)
    );

    let finished = 0;

    requests.forEach(req => {
      req.subscribe({

        next: (p) => {
          this.patients.push(p);
        },

        error: () => {
          finished++;

          if (finished === requests.length) {
            this.loading = false;
          }
        },

        complete: () => {
          finished++;

          if (finished === requests.length) {
            this.loading = false;
          }
        }

      });
    });

  }

  filteredPatients() {
    return this.patients.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectPatient(p: Patient) { this.selectedPatient = p; }

  get activePatients() { return this.patients.length; }
}