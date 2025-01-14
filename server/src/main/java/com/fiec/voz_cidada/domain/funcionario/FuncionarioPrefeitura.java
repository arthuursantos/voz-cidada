package com.fiec.voz_cidada.domain.funcionario;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Entity
@Table(name = "funcionario_prefeitura")
public class FuncionarioPrefeitura implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cpf;
    private String cargo;
    private String setor;
    private LocalDateTime dataCadastro;

}
