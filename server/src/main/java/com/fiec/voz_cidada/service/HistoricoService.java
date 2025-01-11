package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.HistoricoController;
import com.fiec.voz_cidada.controller.UsuarioController;
import com.fiec.voz_cidada.model.dto.HistoricoDTO;
import com.fiec.voz_cidada.model.entity.HistoricoChamado;
import com.fiec.voz_cidada.repository.HistoricoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

@Service
public class HistoricoService extends GenericService<HistoricoChamado, HistoricoDTO, Long> {
    public HistoricoService(HistoricoRepository repository) {
        super(repository, HistoricoDTO.class, HistoricoChamado.class);
    }

    @Override
    protected Link[] generateLinks(HistoricoDTO dto) {
        return new Link[] {
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(HistoricoController.class)
                        .findById(dto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(HistoricoController.class)
                        .findAll(Pageable.unpaged())).withRel("historicos"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(HistoricoController.class)
                        .delete(dto.getId())).withRel("delete")
        };
    }

    @Override
    public Long getResourceID(HistoricoDTO dto) {
        return dto.getId();
    }
}
