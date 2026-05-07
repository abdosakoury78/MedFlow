package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_specialties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSpecialty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @ToString.Exclude
    private Doctor doctor;

    @Column(nullable = false, length = 100)
    private String specialty;

    @Column(name = "doctor_email", length = 150)
    private String doctorEmail;
}