package com.fiec.voz_cidada.domain.historico;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
public class HistoricoDTO extends RepresentationModel<HistoricoDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long chamadoId;
    private Long funcionarioId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataModificacao;
    private String statusAnterior;
    private String statusNovo;
    private String observacao;

}