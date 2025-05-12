package com.fiec.voz_cidada.domain.funcionario;

import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.chamado.Secretaria;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "funcionario_prefeitura")
public class Funcionario implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "auth_user_id", nullable = false)
    private AuthUser authUser;

    @Enumerated(EnumType.STRING)
    private Secretaria secretaria;

    private String cpf;
    private String cargo;
    private LocalDateTime dataCadastro;

}
