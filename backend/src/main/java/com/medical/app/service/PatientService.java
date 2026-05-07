package com.medical.app.service;

import com.medical.app.dto.PatientDTO;
import com.medical.app.entity.Patient;
import com.medical.app.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

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

    public PatientDTO createPatient(PatientDTO dto) {
        Patient patient = Patient.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .location(dto.getLocation())
                .age(dto.getAge())
                .blood(dto.getBlood())
                .gender(dto.getGender())
                .avatar(dto.getAvatar())
                .build();
        return toDTO(patientRepository.save(patient));
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