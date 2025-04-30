package com.fiec.voz_cidada.repository;

import com.fiec.voz_cidada.domain.funcionario.Funcionario;
import org.springframework.stereotype.Repository;

@Repository
public interface FuncionarioRepository extends GenericRepository<Funcionario, Long> {
    Funcionario findByAuthUser_Id(Long id);
}
