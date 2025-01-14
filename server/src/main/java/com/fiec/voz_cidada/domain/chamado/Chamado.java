package com.fiec.voz_cidada.domain.chamado;

import com.fiec.voz_cidada.domain.avaliacao.Avaliacao;
import com.fiec.voz_cidada.domain.historico.HistoricoChamado;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Data
@Entity
@Table(name = "chamado")
public class Chamado implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "chamado", cascade = CascadeType.ALL)
    private List<Avaliacao> avaliacao;

    private LocalDateTime dataAbertura;
    private String status;
    private String secretaria;
    private String fotoUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String descricao;

    @OneToMany(mappedBy = "chamado", cascade = CascadeType.ALL)
    @Fetch(FetchMode.JOIN)
    private List<HistoricoChamado> historicos;

}