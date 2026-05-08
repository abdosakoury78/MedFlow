package com.medical.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PatientSignupRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    private String phone;
    private String location;
    private Integer age;
    private String blood;
    private String gender;
    private String avatar;
}
