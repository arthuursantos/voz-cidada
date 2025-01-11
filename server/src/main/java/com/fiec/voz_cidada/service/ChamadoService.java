package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.ChamadoController;
import com.fiec.voz_cidada.controller.UsuarioController;
import com.fiec.voz_cidada.model.dto.ChamadoDTO;
import com.fiec.voz_cidada.model.entity.Chamado;
import com.fiec.voz_cidada.repository.ChamadoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

@Service
public class ChamadoService extends GenericService<Chamado, ChamadoDTO, Long> {
    public ChamadoService(ChamadoRepository repository) {
        super(repository, ChamadoDTO.class, Chamado.class);
    }

    @Override
    protected Link[] generateLinks(ChamadoDTO dto) {
        return new Link[] {
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ChamadoController.class)
                        .findById(dto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ChamadoController.class)
                        .findAll(Pageable.unpaged())).withRel("chamados"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ChamadoController.class)
                        .delete(dto.getId())).withRel("delete")
        };
    }

    @Override
    public Long getResourceID(ChamadoDTO dto) {
        return dto.getId();
    }
}
