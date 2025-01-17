package com.fiec.voz_cidada.config.security;

import com.fiec.voz_cidada.repository.AuthRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService service;

    @Autowired
    AuthRepository repository;

    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            "/auth/login",
            "/auth/register",
            "/auth/refresh"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (isPublicEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }
        var token = this.recoverToken(request);
        if (token != null) {
            var subject = service.validateAccessToken(token);
            if (subject != null && !subject.isEmpty()) {
                UserDetails user = repository.findById(subject).orElseThrow();
                var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String requestPath = request.getRequestURI();
        return PUBLIC_ENDPOINTS.stream().anyMatch(requestPath::endsWith);
    }

}