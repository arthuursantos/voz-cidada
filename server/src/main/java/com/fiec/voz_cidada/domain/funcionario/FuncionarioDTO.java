package com.fiec.voz_cidada.domain.funcionario;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fiec.voz_cidada.domain.chamado.Secretaria;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDateTime;

@ToString
@Getter
@Setter
public class FuncionarioDTO extends RepresentationModel<FuncionarioDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long authId;
    private String cpf;
    private String cargo;
    private Secretaria secretaria;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataCadastro;

}