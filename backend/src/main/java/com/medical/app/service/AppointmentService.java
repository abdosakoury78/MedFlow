package com.medical.app.service;

import com.medical.app.dto.AppointmentDTO;
import com.medical.app.dto.CreateAppointmentDTO;
import com.medical.app.entity.Appointment;
import com.medical.app.entity.Doctor;
import com.medical.app.entity.Patient;
import com.medical.app.repository.AppointmentRepository;
import com.medical.app.repository.DoctorRepository;
import com.medical.app.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    // ── All appointments for a patient ───────────────
    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Today's appointments ─────────────────────────
    public List<AppointmentDTO> getTodayAppointments(Long patientId) {
        return appointmentRepository
                .findByPatientIdAndAppointmentDate(patientId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Upcoming appointments ────────────────────────
    public List<AppointmentDTO> getUpcomingAppointments(Long patientId) {
        return appointmentRepository
                .findUpcomingByPatient(patientId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Appointment history (COMPLETED) ─────────────
    public List<AppointmentDTO> getHistory(Long patientId) {
        return appointmentRepository
                .findByPatientIdAndStatus(patientId, "COMPLETED")
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Book a new appointment ───────────────────────
    public AppointmentDTO createAppointment(CreateAppointmentDTO req) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .doctorName(doctor.getName())
                .specialty(doctor.getSpecialty())
                .clinic(req.getClinic())
                .appointmentDate(req.getAppointmentDate())
                .appointmentTime(req.getAppointmentTime())
                .duration(req.getDuration() != null ? req.getDuration() : 30)
                .status("UPCOMING")
                .icon(req.getIcon())
                .iconBg(req.getIconBg())
                .build();

        return toDTO(appointmentRepository.save(appointment));
    }

    // ── Cancel an appointment ────────────────────────
    public AppointmentDTO cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("CANCELLED");
        return toDTO(appointmentRepository.save(appointment));
    }

    // ── Complete an appointment ──────────────────────
    public AppointmentDTO completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("COMPLETED");
        return toDTO(appointmentRepository.save(appointment));
    }

    // ── Entity → DTO ─────────────────────────────────
    private AppointmentDTO toDTO(Appointment a) {
        return AppointmentDTO.builder()
                .id(a.getId())
                .doctorId(a.getDoctor().getId())
                .patientId(a.getPatient().getId())
                .doctorName(a.getDoctorName())
                .specialty(a.getSpecialty())
                .clinic(a.getClinic())
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .duration(a.getDuration())
                .status(a.getStatus())
                .icon(a.getIcon())
                .iconBg(a.getIconBg())
                .build();
    }
}