package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.AvaliacaoController;
import com.fiec.voz_cidada.domain.avaliacao.AvaliacaoDTO;
import com.fiec.voz_cidada.domain.avaliacao.Avaliacao;
import com.fiec.voz_cidada.repository.AvaliacaoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

@Service
public class AvaliacaoService extends GenericService<Avaliacao, AvaliacaoDTO, Long> {
    public AvaliacaoService(AvaliacaoRepository repository) {
        super(repository, AvaliacaoDTO.class, Avaliacao.class);
    }

    @Override
    protected Link[] generateLinks(AvaliacaoDTO dto) {
        return new Link[] {
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AvaliacaoController.class)
                        .findById(dto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AvaliacaoController.class)
                        .findAll(Pageable.unpaged())).withRel("avaliacoes"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AvaliacaoController.class)
                        .delete(dto.getId())).withRel("delete")
        };
    }

    @Override
    public Long getResourceID(AvaliacaoDTO dto) {
        return dto.getId();
    }
}
