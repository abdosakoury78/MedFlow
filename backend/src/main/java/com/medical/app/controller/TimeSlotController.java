package com.medical.app.controller;

import com.medical.app.dto.TimeSlotDTO;
import com.medical.app.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    // GET /api/timeslots/doctor/{doctorId}?date=2025-05-12
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<TimeSlotDTO>> getSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Boolean available) {

        if (Boolean.TRUE.equals(available)) {
            return ResponseEntity.ok(
                    timeSlotService.getAvailableSlots(doctorId, date));
        }
        return ResponseEntity.ok(
                timeSlotService.getSlotsForDoctorOnDate(doctorId, date));
    }

    // PATCH /api/timeslots/{id}/book
    @PatchMapping("/{id}/book")
    public ResponseEntity<TimeSlotDTO> bookSlot(@PathVariable Long id) {
        return ResponseEntity.ok(timeSlotService.bookSlot(id));
    }
}