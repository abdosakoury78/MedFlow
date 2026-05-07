package com.medical.app.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingHourDTO {
    private String days;
    private String hours;
    private String doctorEmail;
}