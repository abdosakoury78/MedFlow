package com.medical.app.repository;

import com.medical.app.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // All appointments for a patient
    List<Appointment> findByPatientId(Long patientId);

    // Appointments by status for a patient
    List<Appointment> findByPatientIdAndStatus(Long patientId, String status);

    // Today's appointments for a patient
    List<Appointment> findByPatientIdAndAppointmentDate(
            Long patientId, LocalDate date);

    // Today's appointments for a doctor
    List<Appointment> findByDoctorIdAndAppointmentDate(
            Long doctorId, LocalDate date);

    // Upcoming appointments (date >= today)
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.appointmentDate >= :today AND a.status = 'UPCOMING' " +
           "ORDER BY a.appointmentDate ASC, a.appointmentTime ASC")
    List<Appointment> findUpcomingByPatient(
            @Param("patientId") Long patientId,
            @Param("today") LocalDate today);

    // All appointments for a doctor
    List<Appointment> findByDoctorId(Long doctorId);
}