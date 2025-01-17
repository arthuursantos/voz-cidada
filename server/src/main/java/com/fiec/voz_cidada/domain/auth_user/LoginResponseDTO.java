package com.fiec.voz_cidada.domain.auth_user;

import lombok.Builder;

@Builder
public record LoginResponseDTO(String accessToken, String refreshToken) {
}