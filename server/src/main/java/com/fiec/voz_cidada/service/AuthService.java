package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.config.security.TokenService;
import com.fiec.voz_cidada.domain.auth_user.*;
import com.fiec.voz_cidada.exceptions.InvalidAuthenticationException;
import com.fiec.voz_cidada.repository.AuthRepository;
import com.fiec.voz_cidada.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private AuthRepository repository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private TokenService tokenService;

    public AuthService(AuthRepository repository) {
        this.repository = repository;
    }

    public ResponseEntity<?> login(AuthenticationDTO dto) {
        try {
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
                repository.save(user);
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
