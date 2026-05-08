package com.medical.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_role", nullable = false, length = 20)
    private String recipientRole;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 50)
    private String icon;

    @Column(nullable = false)
    private boolean read;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }
}