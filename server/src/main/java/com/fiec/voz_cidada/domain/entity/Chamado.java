package com.fiec.voz_cidada.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chamado implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "tipo_servico_id")
    private TipoServico tipoServico;

    @OneToOne(mappedBy = "chamado", cascade = CascadeType.ALL)
    private Avaliacao avaliacao;

    private LocalDateTime dataAbertura;
    private String status;
    private String fotoUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String descricao;

    @OneToMany(mappedBy = "chamado")
    private List<HistoricoChamado> historicos;
}