package com.fiec.voz_cidada.domain.avaliacao;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
public class AvaliacaoDTO extends RepresentationModel<AvaliacaoDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long chamadoId;
    private Long usuarioId;
    private Integer estrelas;
    private String comentario;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataAvaliacao;

}