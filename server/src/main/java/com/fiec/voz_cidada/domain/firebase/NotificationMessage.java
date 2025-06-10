package com.fiec.voz_cidada.domain.firebase;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationMessage {
    private Long authUserId;
    private String title;
    private String message;
}