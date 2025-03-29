package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.auth_user.UserRole;
import com.fiec.voz_cidada.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private AuthRepository repository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);
        return processOAuth2User(user);
    }

    private OAuth2User processOAuth2User(OAuth2User oauth2User) {
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");

        AuthUser existingUser = (AuthUser) repository.findByLogin(email);

        if (existingUser == null) {
            System.out.println("google user null");
            String encryptedPassword = new BCryptPasswordEncoder().encode("google-oauth2-" + email);
            AuthUser newUser = new AuthUser(email, encryptedPassword, UserRole.USER);
            repository.save(newUser);
        }

        return oauth2User;
    }
}