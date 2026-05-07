package com.medical.app.service;

import com.medical.app.dto.CreateDoctorDTO;
import com.medical.app.dto.DoctorDTO;
import com.medical.app.dto.WorkingHourDTO;
import com.medical.app.entity.Doctor;
import com.medical.app.entity.DoctorSpecialty;
import com.medical.app.entity.DoctorWorkingHour;
import com.medical.app.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    // ── Get all doctors ──────────────────────────────
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Get doctor by ID ─────────────────────────────
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + id));
        return toDTO(doctor);
    }

    // ── Get doctors by specialty ─────────────────────
    public List<DoctorDTO> getDoctorsBySpecialty(String specialty) {
        if (specialty == null || specialty.equalsIgnoreCase("All")) {
            return getAllDoctors();
        }
        return doctorRepository.findBySpecialtyIgnoreCase(specialty)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Search doctors ───────────────────────────────
    public List<DoctorDTO> searchDoctors(String keyword) {
        return doctorRepository.searchByNameOrSpecialty(keyword)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Get all specialty names ──────────────────────
    public List<String> getAllSpecialties() {
        List<String> specialties = doctorRepository.findAllSpecialties();
        specialties.add(0, "All");
        return specialties;
    }

    // ── Get online doctors ───────────────────────────
    public List<DoctorDTO> getOnlineDoctors() {
        return doctorRepository.findByIsOnline(true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Entity → DTO mapping ─────────────────────────
    public DoctorDTO toDTO(Doctor doctor) {
        List<String> specialtyNames = doctor.getSpecialties()
                .stream()
                .map(s -> s.getSpecialty())
                .collect(Collectors.toList());

        List<WorkingHourDTO> workingHourDTOs = doctor.getWorkingHours()
                .stream()
                .map(wh -> WorkingHourDTO.builder()
                        .days(wh.getDays())
                        .hours(wh.getHours())
                        .build())
                .collect(Collectors.toList());

        return DoctorDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialty(doctor.getSpecialty())
                .experience(doctor.getExperience())
                .rating(doctor.getRating())
                .reviews(doctor.getReviews())
                .patientsCount(doctor.getPatientsCount())
                .avatar(doctor.getAvatar())
                .bio(doctor.getBio())
                .specialties(specialtyNames)
                .workingHours(workingHourDTOs)
                .consultationFee(doctor.getConsultationFee())
                .isOnline(doctor.getIsOnline())
                .build();
    }

    public DoctorDTO createDoctor(CreateDoctorDTO req) {

        // 1. Build the Doctor entity
        Doctor doctor = Doctor.builder()
                .name(req.getName())
                .specialty(req.getSpecialty())
                .experience(req.getExperience())
                .rating(req.getRating())
                .reviews(req.getReviews())
                .patientsCount(req.getPatientsCount())
                .avatar(req.getAvatar())
                .bio(req.getBio())
                .consultationFee(req.getConsultationFee())
                .isOnline(req.getIsOnline() != null ? req.getIsOnline() : false)
                .build();

        // 2. Map specialties list → DoctorSpecialty entities
        if (req.getSpecialtyTags() != null) {
            List<DoctorSpecialty> specialtyEntities = req.getSpecialtyTags()
                    .stream()
                    .map(s -> DoctorSpecialty.builder()
                            .doctor(doctor)
                            .specialty(s)
                            .build())
                    .collect(Collectors.toList());
            doctor.getSpecialties().addAll(specialtyEntities);
        }
        // 3. Map workingHours list → DoctorWorkingHour entities
        if (req.getWorkingHours() != null) {
            List<DoctorWorkingHour> workingHourEntities = req.getWorkingHours()
                    .stream()
                    .map(wh -> DoctorWorkingHour.builder()
                            .doctor(doctor)
                            .days(wh.getDays())
                            .hours(wh.getHours())
                            .build())
                    .collect(Collectors.toList());
            doctor.getWorkingHours().addAll(workingHourEntities);
        }

        // 4. Save and return DTO
        Doctor saved = doctorRepository.save(doctor);
        return toDTO(saved);
    }
}