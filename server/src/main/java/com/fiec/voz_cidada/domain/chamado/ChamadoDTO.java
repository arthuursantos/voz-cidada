package com.fiec.voz_cidada.domain.chamado;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiec.voz_cidada.domain.avaliacao.Avaliacao;
import com.fiec.voz_cidada.domain.avaliacao.AvaliacaoDTO;
import com.fiec.voz_cidada.domain.historico.HistoricoDTO;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ChamadoDTO extends RepresentationModel<ChamadoDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long usuarioId;
    private Long authUserId;
    private String titulo;
    private String descricao;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataAbertura;
    private String status;
    private String fotoAntesUrl;
    private String fotoDepoisUrl;
    private String secretaria;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private AvaliacaoDTO avaliacao;
    private List<HistoricoDTO> historicos;

}