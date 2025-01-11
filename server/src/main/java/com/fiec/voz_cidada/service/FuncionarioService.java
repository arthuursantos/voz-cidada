package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.FuncionarioController;
import com.fiec.voz_cidada.controller.UsuarioController;
import com.fiec.voz_cidada.model.dto.FuncionarioDTO;
import com.fiec.voz_cidada.model.entity.FuncionarioPrefeitura;
import com.fiec.voz_cidada.repository.FuncionarioRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

@Service
public class FuncionarioService extends GenericService<FuncionarioPrefeitura, FuncionarioDTO, Long> {
    public FuncionarioService(FuncionarioRepository repository) {
        super(repository, FuncionarioDTO.class,FuncionarioPrefeitura.class);
    }

    @Override
    protected Link[] generateLinks(FuncionarioDTO dto) {
        return new Link[] {
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FuncionarioController.class)
                        .findById(dto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FuncionarioController.class)
                        .findAll(Pageable.unpaged())).withRel("funcionarios"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FuncionarioController.class)
                        .delete(dto.getId())).withRel("delete")
        };
    }

    @Override
    public Long getResourceID(FuncionarioDTO dto) {
        return dto.getId();
    }
}
