package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.HistoricoController;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.domain.historico.HistoricoDTO;
import com.fiec.voz_cidada.domain.historico.HistoricoChamado;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class HistoricoService extends GenericService<HistoricoChamado, HistoricoDTO, Long> {

    @Autowired
    private HistoricoRepository repository;

    public HistoricoService(HistoricoRepository repository) {
        super(repository, HistoricoDTO.class, HistoricoChamado.class);
    }

    @Override
    public void delete(Long id) {
        HistoricoChamado entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum histórico encontrado."));
        checkAccess(entity.getChamado().getUsuario().getId());
        repository.delete(entity);
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