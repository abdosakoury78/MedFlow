package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_working_hours")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorWorkingHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @ToString.Exclude
    private Doctor doctor;

    @Column(nullable = false, length = 100)
    private String days;

    @Column(nullable = false, length = 100)
    private String hours;

    @Column(name = "doctor_email", length = 150)
    private String doctorEmail;
}