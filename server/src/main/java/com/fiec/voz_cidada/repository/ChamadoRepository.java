package com.fiec.voz_cidada.repository;

import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.domain.chamado.Secretaria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ChamadoRepository extends GenericRepository<Chamado, Long> {
    Page<Chamado> findChamadoByUsuario_Id(Pageable pageable, Long id);
    Page<Chamado> findChamadoBySecretaria(Pageable pageable, Secretaria secretaria);
}