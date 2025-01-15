package com.fiec.voz_cidada.repository;

import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<AuthUser, String> {
    UserDetails findByLogin(String login);
}