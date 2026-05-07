package com.medical.app.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private Integer age;
    private String blood;
    private String gender;
    private String avatar;
}