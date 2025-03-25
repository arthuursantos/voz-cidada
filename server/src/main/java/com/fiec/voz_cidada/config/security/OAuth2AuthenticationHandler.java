package com.fiec.voz_cidada.config.security;

import com.fiec.voz_cidada.config.security.TokenService;
import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.auth_user.LoginResponseDTO;
import com.fiec.voz_cidada.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class OAuth2AuthenticationHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private AuthRepository repository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private ObjectMapper mapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");

        AuthUser user = (AuthUser) repository.findByLogin(email);

        LoginResponseDTO authTokens = tokenService.createAuthTokens(user);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(mapper.writeValueAsString(authTokens));
    }
}