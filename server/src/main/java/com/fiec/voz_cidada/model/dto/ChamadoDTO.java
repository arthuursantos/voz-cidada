package com.fiec.voz_cidada.model.dto;

import com.fiec.voz_cidada.model.entity.HistoricoChamado;
import com.fiec.voz_cidada.model.entity.Usuario;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ChamadoDTO extends RepresentationModel<ChamadoDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Usuario usuarioId;
    private LocalDateTime dataAbertura;
    private String status;
    private String fotoUrl;
    private String secretaria;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String descricao;
    private List<HistoricoChamado> historicos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Usuario usuarioId) {
        this.usuarioId = usuarioId;
    }

    public LocalDateTime getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDateTime dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public String getSecretaria() {
        return secretaria;
    }

    public void setSecretaria(String secretaria) {
        this.secretaria = secretaria;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<HistoricoChamado> getHistoricos() {
        return historicos;
    }

}