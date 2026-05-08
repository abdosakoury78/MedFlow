package com.medical.app.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDTO {
    private Long id;
    private Long recipientId;
    private String recipientRole;
    private Long appointmentId;
    private String title;
    private String icon;
    private boolean read;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}