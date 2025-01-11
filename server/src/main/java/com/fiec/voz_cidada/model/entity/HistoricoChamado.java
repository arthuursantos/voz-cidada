package com.fiec.voz_cidada.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

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

    public HistoricoChamado() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chamado getChamado() {
        return chamado;
    }

    public void setChamado(Chamado chamado) {
        this.chamado = chamado;
    }

    public FuncionarioPrefeitura getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(FuncionarioPrefeitura funcionario) {
        this.funcionario = funcionario;
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

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        HistoricoChamado that = (HistoricoChamado) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
