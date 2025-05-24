package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.auth_user.*;
import com.fiec.voz_cidada.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    @Autowired
    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO dto){
        log.info("AuthController - login - [{}]", dto.login());
        return service.login(dto);
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody GoogleEmailDTO dto) {
        return service.loginWithGoogle(dto);
    }

    @PostMapping("/register/admin")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<?> createAdmin(@RequestBody RegisterDTO dto){
        return service.createAdmin(dto);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto){
        return service.createUser(dto);
    }

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token, @RequestBody ChangePasswordDTO dto) {
        return service.changePassword(token, dto);
    }

    @PatchMapping("/updateAuthStatus")
    public ResponseEntity<?> updateAuthStatus(@RequestHeader("Authorization") String token) {
        return service.patchAuthStatus(token);
    }

}
