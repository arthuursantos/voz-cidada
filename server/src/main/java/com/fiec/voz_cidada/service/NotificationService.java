package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.firebase.NotificationMessage;
import com.fiec.voz_cidada.exceptions.InvalidAuthenticationException;
import com.fiec.voz_cidada.repository.AuthRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    AuthRepository repository;

    public void setToken(AuthUser user, String fcmToken) {
        user.setFcmToken(fcmToken);
        repository.save(user);
    }
    
    public String sendNotificationToUser(NotificationMessage dto) throws FirebaseMessagingException {

        AuthUser user = repository.findById(dto.getAuthUserId()).orElseThrow(() -> new InvalidAuthenticationException("Token para notificações inválido."));

        Notification notification = Notification.builder()
                .setTitle(dto.getTitle())
                .setBody(dto.getMessage())
                .build();
        Message message = Message.builder()
                .setToken(user.getFcmToken())
                .setNotification(notification)
                .build();
        return FirebaseMessaging.getInstance().send(message);
    }
    
}
