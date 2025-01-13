package com.fiec.voz_cidada.domain.chamado;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiec.voz_cidada.domain.historico.HistoricoDTO;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ChamadoDTO extends RepresentationModel<ChamadoDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long usuarioId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataAbertura;
    private String status;
    private String fotoUrl;
    private String secretaria;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String descricao;
    private List<HistoricoDTO> historicos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
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

    public List<HistoricoDTO> getHistoricos() {
        return historicos;
    }

    public void setHistoricos(List<HistoricoDTO> historicos) {
        this.historicos = historicos;
    }
}