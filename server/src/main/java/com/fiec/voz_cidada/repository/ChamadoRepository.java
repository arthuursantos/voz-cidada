package com.fiec.voz_cidada.repository;

import com.fiec.voz_cidada.domain.chamado.Chamado;
import org.springframework.stereotype.Repository;

@Repository
public interface ChamadoRepository extends GenericRepository<Chamado, Long> {
}
