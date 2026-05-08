package com.medical.app.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse<T> {
    private String message;
    private T user;
}
