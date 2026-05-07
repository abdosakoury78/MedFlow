package com.medical.app.repository;

import com.medical.app.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByDoctorIdAndSlotDate(Long doctorId, LocalDate slotDate);

    List<TimeSlot> findByDoctorIdAndSlotDateAndAvailable(
            Long doctorId, LocalDate slotDate, Boolean available);
}