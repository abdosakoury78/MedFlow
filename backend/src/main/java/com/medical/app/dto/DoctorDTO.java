package com.medical.app.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private Long id;
    private String name;
    private String specialty;
    private Integer experience;
    private BigDecimal rating;
    private Integer reviews;
    private Integer patientsCount;
    private String avatar;
    private String bio;
    private List<String> specialties;
    private List<WorkingHourDTO> workingHours;
    private BigDecimal consultationFee;
    private Boolean isOnline;
}