package com.fiec.voz_cidada.domain.avaliacao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "avaliacao")
public class Avaliacao implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "chamado_id")
    @JsonIgnore
    private Chamado chamado;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private Integer estrelas;
    private String comentario;
    private LocalDateTime dataAvaliacao;

}