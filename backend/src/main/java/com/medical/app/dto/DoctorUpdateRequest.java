package com.medical.app.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DoctorUpdateRequest {
    private String name;
    private String specialty;
    private Integer experience;
    private String avatar;
    private String bio;
    private BigDecimal consultationFee;
    private Boolean isOnline;
    private List<String> specialtyTags;
    private List<WorkingHourDTO> workingHours;
}