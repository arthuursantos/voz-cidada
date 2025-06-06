package com.fiec.voz_cidada.repository;

import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.domain.chamado.Secretaria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.hateoas.EntityModel;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends GenericRepository<Chamado, Long> {

    Page<Chamado> findChamadoByUsuario_Id(Pageable pageable, Long id);

    Page<Chamado> findChamadoBySecretaria(Pageable pageable, Secretaria secretaria);

    @Query("SELECT c.status, COUNT(c) as total " +
            "FROM Chamado c " +
            "WHERE c.secretaria = :secretaria " +
            "GROUP BY c.status")
    List<Object[]> countByStatusForSecretaria(@Param("secretaria") Secretaria secretaria);

    @Query("SELECT c.status, COUNT(c) as total " +
            "FROM Chamado c " +
            "GROUP BY c.status")
    List<Object[]> countByStatus();
}