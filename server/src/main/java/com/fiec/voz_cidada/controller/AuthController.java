package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.config.security.TokenService;
import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.auth_user.AuthenticationDTO;
import com.fiec.voz_cidada.domain.auth_user.RegisterDTO;
import com.fiec.voz_cidada.exceptions.InvalidAuthenticationException;
import com.fiec.voz_cidada.repository.AuthRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final AuthRepository repository;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authManager, AuthRepository repository, TokenService tokenService) {
        this.authManager = authManager;
        this.repository = repository;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO data){
<<<<<<< HEAD
        System.out.println("credentials: " + data.login() + " " + data.password());
        var credentials = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = authManager.authenticate(credentials);
        return ResponseEntity.ok(tokenService.createAuthTokens((AuthUser) auth.getPrincipal()));
=======
        try {
            var credentials = new UsernamePasswordAuthenticationToken(data.login(), data.password());
            var auth = authManager.authenticate(credentials);
            return ResponseEntity.ok(tokenService.createAuthTokens((AuthUser) auth.getPrincipal()));
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Seu login ou senha estão incorretos!");
        }

>>>>>>> 6be89f2416bd6e79584d617eb581a35fa3867467
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO data){
        if (repository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        AuthUser newUser = new AuthUser(data.login(), encryptedPassword, data.role());
        repository.save(newUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        String id = tokenService.validateRefreshToken(refreshToken.replace("Bearer ", ""));
        var user = repository.findById(Long.valueOf(id))
                .orElseThrow(() -> new InvalidAuthenticationException("Não foi possível renovar sua autenticação."));
        return ResponseEntity.ok(tokenService.createAuthTokens(user));
    }

}
