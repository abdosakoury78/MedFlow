package com.medical.app.service;

import com.medical.app.dto.AuthRequest;
import com.medical.app.dto.AuthResponse;
import com.medical.app.dto.PatientDTO;
import com.medical.app.dto.PatientSignupRequest;
import com.medical.app.entity.Patient;
import com.medical.app.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + id));
        return toDTO(patient);
    }

    public PatientDTO getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + email));
        return toDTO(patient);
    }

    public AuthResponse<PatientDTO> createPatient(PatientSignupRequest req) {
        if (patientRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email already registered: " + req.getEmail());
        }
        Patient patient = Patient.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .location(req.getLocation())
                .age(req.getAge())
                .blood(req.getBlood())
                .gender(req.getGender())
                .avatar(req.getAvatar())
                .build();
        Patient saved = patientRepository.save(patient);
        return AuthResponse.<PatientDTO>builder()
                .message("Patient registered successfully")
                .user(toDTO(saved))
                .build();
    }

    public PatientDTO updatePatient(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + id));
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhone());
        patient.setLocation(dto.getLocation());
        patient.setAge(dto.getAge());
        patient.setBlood(dto.getBlood());
        patient.setGender(dto.getGender());
        patient.setAvatar(dto.getAvatar());
        return toDTO(patientRepository.save(patient));
    }

    public AuthResponse<PatientDTO> loginPatient(AuthRequest req) {
        Patient patient = patientRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), patient.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return AuthResponse.<PatientDTO>builder()
                .message("Patient logged in successfully")
                .user(toDTO(patient))
                .build();
    }

    private PatientDTO toDTO(Patient p) {
        return PatientDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .email(p.getEmail())
                .phone(p.getPhone())
                .location(p.getLocation())
                .age(p.getAge())
                .blood(p.getBlood())
                .gender(p.getGender())
                .avatar(p.getAvatar())
                .build();
    }
}