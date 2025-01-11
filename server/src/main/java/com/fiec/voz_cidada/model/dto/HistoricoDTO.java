package com.fiec.voz_cidada.model.dto;

import com.fiec.voz_cidada.model.entity.Chamado;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDateTime;

public class HistoricoDTO extends RepresentationModel<HistoricoDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Chamado chamadoId;
    private LocalDateTime dataModificacao;
    private String statusAnterior;
    private String statusNovo;
    private String observacao;

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

    public LocalDateTime getDataModificacao() {
        return dataModificacao;
    }

    public void setDataModificacao(LocalDateTime dataModificacao) {
        this.dataModificacao = dataModificacao;
    }

    public String getStatusAnterior() {
        return statusAnterior;
    }

    public void setStatusAnterior(String statusAnterior) {
        this.statusAnterior = statusAnterior;
    }

    public String getStatusNovo() {
        return statusNovo;
    }

    public void setStatusNovo(String statusNovo) {
        this.statusNovo = statusNovo;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}