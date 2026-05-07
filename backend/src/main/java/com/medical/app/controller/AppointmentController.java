package com.medical.app.controller;

import com.medical.app.dto.AppointmentDTO;
import com.medical.app.dto.CreateAppointmentDTO;
import com.medical.app.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    // GET /api/appointments/patient/{patientId}
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDTO>> getPatientAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService.getPatientAppointments(patientId));
    }

    // GET /api/appointments/patient/{patientId}/today
    @GetMapping("/patient/{patientId}/today")
    public ResponseEntity<List<AppointmentDTO>> getTodayAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService.getTodayAppointments(patientId));
    }

    // GET /api/appointments/patient/{patientId}/upcoming
    @GetMapping("/patient/{patientId}/upcoming")
    public ResponseEntity<List<AppointmentDTO>> getUpcomingAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService.getUpcomingAppointments(patientId));
    }

    // GET /api/appointments/patient/{patientId}/history
    @GetMapping("/patient/{patientId}/history")
    public ResponseEntity<List<AppointmentDTO>> getHistory(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService.getHistory(patientId));
    }

    // POST /api/appointments
    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(
            @RequestBody CreateAppointmentDTO dto) {
        return ResponseEntity.ok(
                appointmentService.createAppointment(dto));
    }

    // PATCH /api/appointments/{id}/cancel
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentDTO> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    // PATCH /api/appointments/{id}/complete
    @PatchMapping("/{id}/complete")
    public ResponseEntity<AppointmentDTO> completeAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }
}