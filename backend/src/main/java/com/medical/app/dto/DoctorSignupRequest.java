package com.medical.app.dto;

import com.medical.app.entity.DoctorSpecialty;
import com.medical.app.entity.DoctorWorkingHour;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DoctorSignupRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Specialty is required")
    private String specialty;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    private Integer experience;
    private BigDecimal rating;
    private Integer reviews;
    private Integer patientsCount;
    private String avatar;
    private String bio;
    private BigDecimal consultationFee;
    private Boolean isOnline;
    private List<String> specialtyTags;
    private List<WorkingHourDTO> workingHours;
}
