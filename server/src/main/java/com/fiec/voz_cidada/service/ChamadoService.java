package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.ChamadoController;
import com.fiec.voz_cidada.domain.chamado.ChamadoDTO;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import com.fiec.voz_cidada.repository.ChamadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChamadoService extends GenericService<Chamado, ChamadoDTO, Long> {

    @Autowired
    private ChamadoRepository repository;

    public ChamadoService(ChamadoRepository repository) {
        super(repository, ChamadoDTO.class, Chamado.class);
    }

    public EntityModel<ChamadoDTO> create(ChamadoDTO dto) {
        Chamado entity = convertToEntity(dto);

        if (dto.getFotoAntesUrl() != null && !dto.getFotoAntesUrl().isEmpty()) {
            entity.setFotoAntesUrl(dto.getFotoAntesUrl());
        }

        if (entity.getDataAbertura() == null) {
            entity.setDataAbertura(LocalDateTime.now());
        }

        if (entity.getStatus() == null || entity.getStatus().isEmpty()) {
            entity.setStatus("PENDENTE");
        }

        Chamado savedEntity = repository.save(entity);
        ChamadoDTO savedDto = convertToDto(savedEntity);
        return EntityModel.of(savedDto, generateLinks(savedDto));
    }

    public PagedModel<EntityModel<ChamadoDTO>> findMy(Long id, Pageable pageable) {
        Page<Chamado> entities = repository.findChamadoByUsuario_Id(pageable, id);
        Page<ChamadoDTO> dtos = entities.map(this::convertToDto);
        return assembler.toModel(dtos, dto -> EntityModel.of(dto, generateLinks(dto)));
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