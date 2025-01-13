package com.fiec.voz_cidada.repository;

import com.fiec.voz_cidada.domain.funcionario.FuncionarioPrefeitura;
import org.springframework.stereotype.Repository;

@Repository
public interface FuncionarioRepository extends GenericRepository<FuncionarioPrefeitura, Long> {
}
