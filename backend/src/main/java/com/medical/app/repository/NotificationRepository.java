package com.medical.app.repository;

import com.medical.app.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientRoleAndRecipientIdOrderByCreatedAtDesc(String recipientRole, Long recipientId);

    long countByRecipientRoleAndRecipientIdAndReadFalse(String recipientRole, Long recipientId);

    List<Notification> findByRecipientRoleAndRecipientIdAndReadFalseOrderByCreatedAtDesc(String recipientRole,
            Long recipientId);

    void deleteByRecipientRoleAndRecipientId(String recipientRole, Long recipientId);
}