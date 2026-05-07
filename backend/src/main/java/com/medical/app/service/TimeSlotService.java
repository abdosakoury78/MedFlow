package com.medical.app.service;

import com.medical.app.dto.TimeSlotDTO;
import com.medical.app.entity.TimeSlot;
import com.medical.app.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    public List<TimeSlotDTO> getSlotsForDoctorOnDate(Long doctorId, LocalDate date) {
        return timeSlotRepository
                .findByDoctorIdAndSlotDate(doctorId, date)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TimeSlotDTO> getAvailableSlots(Long doctorId, LocalDate date) {
        return timeSlotRepository
                .findByDoctorIdAndSlotDateAndAvailable(doctorId, date, true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Mark a slot as booked
    public TimeSlotDTO bookSlot(Long slotId) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        slot.setAvailable(false);
        return toDTO(timeSlotRepository.save(slot));
    }

    private TimeSlotDTO toDTO(TimeSlot ts) {
        return TimeSlotDTO.builder()
                .id(ts.getId())
                .doctorId(ts.getDoctor() != null ? ts.getDoctor().getId() : null)
                .slotDate(ts.getSlotDate())
                .time(ts.getTime())
                .available(ts.getAvailable())
                .build();
    }
}