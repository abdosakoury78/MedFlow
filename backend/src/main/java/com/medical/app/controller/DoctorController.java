package com.medical.app.controller;

import com.medical.app.dto.CreateDoctorDTO;
import com.medical.app.dto.DoctorDTO;
import com.medical.app.service.DoctorService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    // GET /api/doctors
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors(
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(doctorService.searchDoctors(search));
        }
        if (specialty != null && !specialty.isBlank()) {
            return ResponseEntity.ok(doctorService.getDoctorsBySpecialty(specialty));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // GET /api/doctors/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    // GET /api/doctors/specialties
    @GetMapping("/specialties")
    public ResponseEntity<List<String>> getSpecialties() {
        return ResponseEntity.ok(doctorService.getAllSpecialties());
    }

    // GET /api/doctors/online
    @GetMapping("/online")
    public ResponseEntity<List<DoctorDTO>> getOnlineDoctors() {
        return ResponseEntity.ok(doctorService.getOnlineDoctors());
    }

    @PostMapping
    public ResponseEntity<DoctorDTO> createDoctor(
            @RequestBody CreateDoctorDTO dto) {
        DoctorDTO created = doctorService.createDoctor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}