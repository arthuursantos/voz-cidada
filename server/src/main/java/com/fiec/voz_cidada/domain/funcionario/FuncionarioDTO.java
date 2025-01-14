package com.fiec.voz_cidada.domain.funcionario;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
public class FuncionarioDTO extends RepresentationModel<FuncionarioDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String cpf;
    private String cargo;
    private String setor;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataCadastro;

}