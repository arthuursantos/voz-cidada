package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.firebase.NotificationMessage;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import com.fiec.voz_cidada.service.AuthService;
import com.fiec.voz_cidada.service.UsuarioService;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    AuthService service;

    @PostMapping
    public void notifyUser(@RequestBody NotificationMessage messageObject) throws IOException {
        Long authUserId = messageObject.getAuthUserId();
        AuthUser user = service.findById(authUserId);
        String token = user.getFcmToken();

        Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(messageObject.getTitle())
                        .setBody(messageObject.getMessage())
                        .build())
                .build();

        String resp = null;
        try {
            resp = FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            throw new RuntimeException(e);
        }
        System.out.println("Successfully sent message: " + resp);
    }


}