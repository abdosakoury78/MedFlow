package com.medical.app.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDoctorDTO {

    private String name;
    private String specialty; // Primary specialty
    private String email;
    private Integer experience;
    private BigDecimal rating;
    private Integer reviews;
    private Integer patientsCount;
    private String avatar;
    private String bio;
    private List<String> specialtyTags; // Renamed to clarify these are tags/additional specialties
    private List<WorkingHourDTO> workingHours;
    private BigDecimal consultationFee;
    private Boolean isOnline;
}