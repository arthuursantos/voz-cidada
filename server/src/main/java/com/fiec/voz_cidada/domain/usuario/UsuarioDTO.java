package com.fiec.voz_cidada.domain.usuario;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UsuarioDTO extends RepresentationModel<UsuarioDTO> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String nome;
    private String cpf;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataNascimento;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataCadastro;
    private String cep;
    private String rua;
    private String numero;
    private String bairro;
    private String complemento;
    private String cidade;
    private String uf;

}