package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.config.security.TokenService;
import com.fiec.voz_cidada.domain.auth_user.*;
import com.fiec.voz_cidada.exceptions.InvalidAuthenticationException;
import com.fiec.voz_cidada.repository.AuthRepository;
import com.fiec.voz_cidada.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.View;

@Slf4j
@Service
public class AuthService implements UserDetailsService {

    private final AuthRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final View error;

    @Autowired
    public AuthService(AuthRepository repository,
                       UsuarioRepository usuarioRepository,
                       TokenService tokenService,
                       AuthenticationConfiguration authenticationConfiguration, View error) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
        this.authenticationConfiguration = authenticationConfiguration;
        this.error = error;
    }
    public ResponseEntity<?> login(AuthenticationDTO dto) {
        try {
            AuthenticationManager authManager = authenticationConfiguration.getAuthenticationManager();
            var credentials = new UsernamePasswordAuthenticationToken(dto.login(), dto.password());
            var auth = authManager.authenticate(credentials);
            return ResponseEntity.ok(tokenService.createAuthTokens((AuthUser) auth.getPrincipal()));
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Seu login ou senha estão incorretos!");
        }
    }

    public ResponseEntity<?> loginWithGoogle(GoogleEmailDTO dto) {
        try {
            AuthUser user = (AuthUser) repository.findByLogin(dto.email());
            if (user == null) {
                user = new AuthUser(
                        dto.email(),
                        new BCryptPasswordEncoder().encode("google-oauth-" + dto.email()),
                        UserRole.USER,
                        AuthStatus.SIGNIN);

                AuthUser savedAuth = repository.save(user);
                StackTraceElement currentMethod = Thread.currentThread().getStackTrace()[1];
                String logMsg = "Usuário de autenticação criado com OAuth. ID " + savedAuth.getId();
                log.info("{} > {} > {}", currentMethod.getClassName(), currentMethod.getMethodName(), logMsg);

            }
            LoginResponseDTO tokens = tokenService.createAuthTokens(user);
            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Não foi possível se autenticar com a conta Google.");
        }
    }

    public ResponseEntity<?> createUser(RegisterDTO dto) {
        try {
            if (repository.findByLogin(dto.login()) != null) return ResponseEntity.badRequest().build();
            String encryptedPassword = new BCryptPasswordEncoder().encode(dto.password());
            AuthUser newUser = new AuthUser(dto.login(), encryptedPassword, UserRole.USER, AuthStatus.SIGNUP);

            repository.save(newUser);
            StackTraceElement currentMethod = Thread.currentThread().getStackTrace()[1];
            String logMsg = "Usuário de autenticação criado. ID " + newUser.getId();
            log.info("{} > {} > {}", currentMethod.getClassName(), currentMethod.getMethodName(), logMsg);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Não foi possível criar o usuário.");
        }
    }

    public ResponseEntity<?> createAdmin(RegisterDTO dto) {
        try {
            if (repository.findByLogin(dto.login()) != null) return ResponseEntity.badRequest().build();
            String encryptedPassword = new BCryptPasswordEncoder().encode(dto.password());
            AuthUser newUser = new AuthUser(dto.login(), encryptedPassword, UserRole.ADMIN, AuthStatus.SIGNUP);

            repository.save(newUser);
            StackTraceElement currentMethod = Thread.currentThread().getStackTrace()[1];
            String logMsg = "Usuário de autenticação com ROLE_ADMIN criado. ID " + newUser.getId();
            log.info("{} > {} > {}", currentMethod.getClassName(), currentMethod.getMethodName(), logMsg);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Não foi possível criar o administrador.");
        }
    }

    public ResponseEntity<?> changePassword(String token, ChangePasswordDTO dto) {
        try {
            String id = tokenService.validateAccessToken(token.replace("Bearer ", ""));
            if (id == null) {
                throw new InvalidAuthenticationException("Token inválido ou expirado.");
            }

            var user = repository.findById(Long.valueOf(id))
                    .orElseThrow(() -> new InvalidAuthenticationException("Usuário não encontrado."));

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
                throw new InvalidAuthenticationException("Senha atual incorreta.");
            }

            String encryptedPassword = passwordEncoder.encode(dto.newPassword());
            user.changePassword(encryptedPassword);

            repository.save(user);
            StackTraceElement currentMethod = Thread.currentThread().getStackTrace()[1];
            String logMsg = "Senha alterada. AuthUser ID " + user.getId();
            log.info("{} > {} > {}", currentMethod.getClassName(), currentMethod.getMethodName(), logMsg);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Não foi possível alterar a senha.");
        }
    }

    public ResponseEntity<?> patchAuthStatus(String token) {
        try {
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
            StackTraceElement currentMethod = Thread.currentThread().getStackTrace()[1];
            String logMsg = "Status de autenticação do usuário alterado. AuthUser ID " + user.getId();
            log.info("{} > {} > {}", currentMethod.getClassName(), currentMethod.getMethodName(), logMsg);

            LoginResponseDTO tokens = tokenService.createAuthTokens(user);

            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            throw new InvalidAuthenticationException("Não foi possível atualizar a autenticação do usuário.");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByLogin(username);
    }
}
