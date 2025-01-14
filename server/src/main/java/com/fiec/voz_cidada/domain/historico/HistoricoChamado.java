package com.fiec.voz_cidada.domain.historico;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.domain.funcionario.FuncionarioPrefeitura;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Entity
@Table(name = "historico_chamado")
public class HistoricoChamado implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chamado_id")
    private Chamado chamado;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    @JsonIgnore
    private FuncionarioPrefeitura funcionario;

    private LocalDateTime dataModificacao;
    private String statusAnterior;
    private String statusNovo;
    private String observacao;

}
