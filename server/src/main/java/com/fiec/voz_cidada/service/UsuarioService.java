package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.UsuarioController;
import com.fiec.voz_cidada.domain.usuario.UsuarioDTO;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import com.fiec.voz_cidada.repository.UsuarioRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService extends GenericService<Usuario, UsuarioDTO, Long> {

    public UsuarioService(UsuarioRepository repository) {
        super(repository, UsuarioDTO.class, Usuario.class);
    }

    @Override
    protected Link[] generateLinks(UsuarioDTO dto) {
        return new Link[] {
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UsuarioController.class)
                        .findById(dto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UsuarioController.class)
                        .findAll(Pageable.unpaged())).withRel("usuarios"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UsuarioController.class)
                        .delete(dto.getId())).withRel("delete")
        };
    }

    @Override
    public Long getResourceID(UsuarioDTO dto) {
        return dto.getId();
    }

}
