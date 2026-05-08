package com.medical.app.service;

import com.medical.app.dto.NotificationDTO;
import com.medical.app.entity.Appointment;
import com.medical.app.entity.Notification;
import com.medical.app.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createAppointmentBookedNotifications(Appointment appointment) {
        createNotification(
                "PATIENT",
                appointment.getPatient().getId(),
                appointment.getId(),
                "Appointment booked with Dr. " + appointment.getDoctor().getName() + " on "
                        + appointment.getAppointmentDate() + " at " + appointment.getAppointmentTime(),
                "fa-calendar-check");

        createNotification(
                "DOCTOR",
                appointment.getDoctor().getId(),
                appointment.getId(),
                "New appointment booked by " + appointment.getPatient().getName() + " on "
                        + appointment.getAppointmentDate() + " at " + appointment.getAppointmentTime(),
                "fa-calendar-plus");
    }

    public void createAppointmentCancelledNotifications(Appointment appointment) {
        createNotification(
                "PATIENT",
                appointment.getPatient().getId(),
                appointment.getId(),
                "Appointment cancelled with Dr. " + appointment.getDoctor().getName(),
                "fa-calendar-xmark");

        createNotification(
                "DOCTOR",
                appointment.getDoctor().getId(),
                appointment.getId(),
                "Appointment cancelled by " + appointment.getPatient().getName(),
                "fa-calendar-xmark");
    }

    public void createAppointmentCompletedNotifications(Appointment appointment) {
        createNotification(
                "PATIENT",
                appointment.getPatient().getId(),
                appointment.getId(),
                "Appointment completed with Dr. " + appointment.getDoctor().getName(),
                "fa-circle-check");

        createNotification(
                "DOCTOR",
                appointment.getDoctor().getId(),
                appointment.getId(),
                "Appointment completed for " + appointment.getPatient().getName(),
                "fa-circle-check");
    }

    public List<NotificationDTO> getNotifications(String recipientRole, Long recipientId) {
        return notificationRepository
                .findByRecipientRoleAndRecipientIdOrderByCreatedAtDesc(recipientRole, recipientId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String recipientRole, Long recipientId) {
        return notificationRepository.countByRecipientRoleAndRecipientIdAndReadFalse(recipientRole, recipientId);
    }

    public List<NotificationDTO> markAllAsRead(String recipientRole, Long recipientId) {
        List<Notification> unreadNotifications = notificationRepository
                .findByRecipientRoleAndRecipientIdAndReadFalseOrderByCreatedAtDesc(recipientRole, recipientId);

        LocalDateTime readAt = LocalDateTime.now();
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(readAt);
        });

        return notificationRepository.saveAll(unreadNotifications)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void clearAll(String recipientRole, Long recipientId) {
        notificationRepository.deleteByRecipientRoleAndRecipientId(recipientRole, recipientId);
    }

    private void createNotification(String recipientRole, Long recipientId, Long appointmentId, String title,
            String icon) {
        Notification notification = Notification.builder()
                .recipientRole(recipientRole)
                .recipientId(recipientId)
                .appointmentId(appointmentId)
                .title(title)
                .icon(icon)
                .build();
        notificationRepository.save(notification);
    }

    private NotificationDTO toDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipientId())
                .recipientRole(notification.getRecipientRole())
                .appointmentId(notification.getAppointmentId())
                .title(notification.getTitle())
                .icon(notification.getIcon())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}