package com.fiec.voz_cidada.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.auth_user.LoginResponseDTO;
import com.fiec.voz_cidada.exceptions.InvalidAuthenticationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${security.token.secret")
    private String secret;
    @Value("${security.token.expire-length}")
    private Long expireLength;

    private static final String tokenTypeClaim = "token_type";
    private static final String rolesClaim = "roles";

    public LoginResponseDTO createAuthTokens(AuthUser user) {
        return LoginResponseDTO.builder()
                .accessToken(createAccessToken(user))
                .refreshToken(createRefreshToken(user))
                .build();
    }

    public String createAccessToken(AuthUser user) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        String issuerUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
        try {
            return JWT.create()
                    .withIssuer(issuerUrl)
                    .withSubject(String.valueOf(user.getId()))
                    .withClaim(tokenTypeClaim, "ACCESS")
                    .withClaim(rolesClaim, user.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .toList())
                    .withClaim("auth_status", user.getAuthStatus().getAuthType())
                    .withExpiresAt(LocalDateTime.now().plusSeconds(expireLength).toInstant(ZoneOffset.of("-03:00")))
                    .sign(algorithm);
        } catch (InvalidAuthenticationException e) {
            throw new InvalidAuthenticationException("Não foi possível se autenticar: " + e.getMessage());
        }
    }

    private String createRefreshToken(AuthUser user) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        String issuerUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
        try {
            return JWT.create()
                    .withIssuer(issuerUrl)
                    .withSubject(String.valueOf(user.getId()))
                    .withClaim(tokenTypeClaim, "REFRESH")
                    .withExpiresAt(LocalDateTime.now().plusSeconds(expireLength*24).toInstant(ZoneOffset.of("-03:00")))
                    .sign(algorithm);
        } catch (InvalidAuthenticationException e) {
            throw new InvalidAuthenticationException("Não foi possível se autenticar: " + e.getMessage());
        }
    }

    public String getTokenSubject(String token, String tokenType) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        String issuerUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
        try {
            return JWT.require(algorithm)
                    .withIssuer(issuerUrl)
                    .withClaim(tokenTypeClaim, tokenType)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (InvalidAuthenticationException e) {
            throw new InvalidAuthenticationException("Não foi possível validar a autenticação: " + e.getMessage());
        }
    }

    public String validateAccessToken(String token) {
        return getTokenSubject(token, "ACCESS");
    }

    public String validateRefreshToken(String token) {
        return getTokenSubject(token, "REFRESH");
    }

}
