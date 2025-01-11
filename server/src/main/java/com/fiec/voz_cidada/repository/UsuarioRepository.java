package com.fiec.voz_cidada.repository;

import com.fiec.voz_cidada.model.entity.Usuario;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends GenericRepository<Usuario, Long> {
}
