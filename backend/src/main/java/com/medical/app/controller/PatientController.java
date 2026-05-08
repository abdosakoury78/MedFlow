package com.medical.app.controller;

import com.medical.app.dto.AuthRequest;
import com.medical.app.dto.AuthResponse;
import com.medical.app.dto.PatientDTO;
import com.medical.app.dto.PatientSignupRequest;
import com.medical.app.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    // GET /api/patients/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    // GET /api/patients/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<PatientDTO> getPatientByEmail(@PathVariable String email) {
        return ResponseEntity.ok(patientService.getPatientByEmail(email));
    }

    // POST /api/patients
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse<PatientDTO>> signupPatient(
            @Valid @RequestBody PatientSignupRequest req) {
        AuthResponse<PatientDTO> response = patientService.createPatient(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse<PatientDTO>> loginPatient(
            @Valid @RequestBody AuthRequest req) {
        AuthResponse<PatientDTO> response = patientService.loginPatient(req);
        return ResponseEntity.ok(response);
    }

    // PUT /api/patients/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(
            @PathVariable Long id, @RequestBody PatientDTO dto) {
        return ResponseEntity.ok(patientService.updatePatient(id, dto));
    }
}