package com.fiec.voz_cidada.repository;

import com.fiec.voz_cidada.domain.avaliacao.Avaliacao;
import org.springframework.stereotype.Repository;

@Repository
public interface AvaliacaoRepository extends GenericRepository<Avaliacao, Long> {
    boolean existsByChamadoId(Long chamadoId);
}
