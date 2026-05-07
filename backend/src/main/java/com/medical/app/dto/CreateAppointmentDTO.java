package com.medical.app.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAppointmentDTO {
    private Long patientId;
    private Long doctorId;
    private String clinic;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private Integer duration;
    private String icon;
    private String iconBg;
}