package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.config.security.TokenService;
import com.fiec.voz_cidada.domain.auth_user.*;
import com.fiec.voz_cidada.exceptions.InvalidAuthenticationException;
import com.fiec.voz_cidada.repository.AuthRepository;
import com.fiec.voz_cidada.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

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
        try {
            var credentials = new UsernamePasswordAuthenticationToken(data.login(), data.password());
            var auth = authManager.authenticate(credentials);
            return ResponseEntity.ok(tokenService.createAuthTokens((AuthUser) auth.getPrincipal()));
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Seu login ou senha estão incorretos!");
        }
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleEmailDTO data) {
        try {
            AuthUser user = (AuthUser) repository.findByLogin(data.email());
            if (user == null) {
                user = new AuthUser(
                        data.email(),
                        new BCryptPasswordEncoder().encode("google-oauth-" + data.email()),
                        UserRole.USER,
                        AuthStatus.SIGNIN);
                repository.save(user);
            }
            LoginResponseDTO tokens = tokenService.createAuthTokens(user);
            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Não foi possível se autenticar com sua conta Google.");
        }
    }

    @PostMapping("/register/admin")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterDTO data){
        if (repository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();
        System.out.println(data.login()+" "+data.password());
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        AuthUser newUser = new AuthUser(data.login(), encryptedPassword, UserRole.ADMIN, AuthStatus.SIGNUP);
        repository.save(newUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO data){
        if (repository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        AuthUser newUser = new AuthUser(data.login(), encryptedPassword, UserRole.USER, AuthStatus.SIGNUP);
        repository.save(newUser);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token, @RequestBody ChangePasswordDTO data) {
        String id = tokenService.validateAccessToken(token.replace("Bearer ", ""));
        if (id == null) {
            throw new InvalidAuthenticationException("Token inválido ou expirado.");
        }

        var user = repository.findById(Long.valueOf(id))
                .orElseThrow(() -> new InvalidAuthenticationException("Usuário não encontrado."));

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(data.currentPassword(), user.getPassword())) {
            throw new InvalidAuthenticationException("Senha atual incorreta.");
        }

        String encryptedPassword = passwordEncoder.encode(data.newPassword());
        user.changePassword(encryptedPassword);
        repository.save(user);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/updateAuthStatus")
    public ResponseEntity<?> updateAuthStatus(@RequestHeader("Authorization") String token) {
        String id = tokenService.validateAccessToken(token.replace("Bearer ", ""));
        if (id == null) {
            throw new InvalidAuthenticationException("Token inválido ou expirado.");
        }

        var user = repository.findById(Long.valueOf(id))
                .orElseThrow(() -> new InvalidAuthenticationException("Usuário não encontrado."));

        var profile = usuarioRepository.findByAuthUser_Id(Long.valueOf(id));
        if (profile == null) {
            throw new InvalidAuthenticationException("Não foi possível atualizar a autenticação do usuário.");
        }

        user.updateAuthStatus("SIGNUP");
        repository.save(user);
        LoginResponseDTO tokens = tokenService.createAuthTokens(user);

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        String id = tokenService.validateRefreshToken(refreshToken.replace("Bearer ", ""));
        var user = repository.findById(Long.valueOf(id))
                .orElseThrow(() -> new InvalidAuthenticationException("Não foi possível renovar sua autenticação."));
        return ResponseEntity.ok(tokenService.createAuthTokens(user));
    }

}
