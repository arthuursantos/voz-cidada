package com.fiec.voz_cidada.model.dto;

import com.fiec.voz_cidada.model.entity.Chamado;
import com.fiec.voz_cidada.model.entity.Usuario;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDateTime;

public class AvaliacaoDTO extends RepresentationModel<AvaliacaoDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Chamado chamadoId;
    private Usuario usuarioId;
    private Integer estrelas;
    private String comentario;
    private LocalDateTime dataAvaliacao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chamado getChamadoId() {
        return chamadoId;
    }

    public void setChamadoId(Chamado chamadoId) {
        this.chamadoId = chamadoId;
    }

    public Usuario getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Usuario usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Integer getEstrelas() {
        return estrelas;
    }

    public void setEstrelas(Integer estrelas) {
        this.estrelas = estrelas;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDateTime getDataAvaliacao() {
        return dataAvaliacao;
    }

    public void setDataAvaliacao(LocalDateTime dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}