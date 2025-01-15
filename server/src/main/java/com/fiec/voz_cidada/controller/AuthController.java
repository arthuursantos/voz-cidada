package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.config.security.TokenService;
import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.auth_user.AuthenticationDTO;
import com.fiec.voz_cidada.domain.auth_user.LoginResponseDTO;
import com.fiec.voz_cidada.domain.auth_user.RegisterDTO;
import com.fiec.voz_cidada.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private AuthRepository repository;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO data){
        var credentials = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = authManager.authenticate(credentials);
        var accesstoken = tokenService.generateToken((AuthUser) auth.getPrincipal());
        return ResponseEntity.ok(new LoginResponseDTO(accesstoken));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO data){
        if (repository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        AuthUser newUser = new AuthUser(data.login(), encryptedPassword, data.role());
        repository.save(newUser);
        return ResponseEntity.ok().build();
    }
}
