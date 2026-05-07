package com.medical.app.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private Long id;
    private Long doctorId;
    private Long patientId;
    private String doctorName;
    private String specialty;
    private String clinic;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private Integer duration;
    private String status;
    private String icon;
    private String iconBg;
}