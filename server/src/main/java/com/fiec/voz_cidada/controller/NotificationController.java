package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.firebase.NotificationMessage;
import com.fiec.voz_cidada.service.NotificationService;
import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    NotificationService service;

    @PostMapping("/setToken")
    public void setToken(@AuthenticationPrincipal AuthUser user, @RequestBody String fcmToken) {
        service.setToken(user, fcmToken);
    }

        @PostMapping("/sendToUser")
    public String sendToUser(@RequestBody NotificationMessage dto) throws FirebaseMessagingException {
        return service.sendNotificationToUser(dto);
    }

}