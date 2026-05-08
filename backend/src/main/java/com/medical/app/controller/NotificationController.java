package com.medical.app.controller;

import com.medical.app.dto.NotificationDTO;
import com.medical.app.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/recipient/{role}/{recipientId}")
    public ResponseEntity<List<NotificationDTO>> getNotifications(
            @PathVariable String role,
            @PathVariable Long recipientId) {
        return ResponseEntity.ok(notificationService.getNotifications(role, recipientId));
    }

    @GetMapping("/recipient/{role}/{recipientId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable String role,
            @PathVariable Long recipientId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(role, recipientId));
    }

    @PatchMapping("/recipient/{role}/{recipientId}/read-all")
    public ResponseEntity<List<NotificationDTO>> markRecipientAsRead(
            @PathVariable String role,
            @PathVariable Long recipientId) {
        return ResponseEntity.ok(notificationService.markAllAsRead(role, recipientId));
    }

    @DeleteMapping("/recipient/{role}/{recipientId}")
    public ResponseEntity<Void> clearAll(
            @PathVariable String role,
            @PathVariable Long recipientId) {
        notificationService.clearAll(role, recipientId);
        return ResponseEntity.noContent().build();
    }
}