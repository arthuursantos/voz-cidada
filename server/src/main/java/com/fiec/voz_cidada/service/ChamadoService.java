package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.ChamadoController;
import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.chamado.ChamadoDTO;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.domain.chamado.Secretaria;
import com.fiec.voz_cidada.domain.funcionario.Funcionario;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.exceptions.UnauthorizedException;
import com.fiec.voz_cidada.repository.ChamadoRepository;
import com.fiec.voz_cidada.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChamadoService extends GenericService<Chamado, ChamadoDTO, Long> {

    @Autowired
    private ChamadoRepository repository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public ChamadoService(ChamadoRepository repository) {
        super(repository, ChamadoDTO.class, Chamado.class);
    }

    @Override
    public EntityModel<ChamadoDTO> create(ChamadoDTO dto) {
        checkAccess(dto.getUsuarioId());
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

        ChamadoDTO savedDto = convertToDto(repository.save(entity));
        return EntityModel.of(savedDto, generateLinks(savedDto));
    }

    public ResponseEntity<PagedModel<EntityModel<ChamadoDTO>>> findByUserId(Long id, Pageable pageable) {
        checkAccess(id);
        Page<Chamado> entities = repository.findChamadoByUsuario_Id(pageable, id);
        Page<ChamadoDTO> dtos = entities.map(this::convertToDto);
        return ResponseEntity.ok(assembler.toModel(dtos, dto -> EntityModel.of(dto, generateLinks(dto))));
    }

    public ResponseEntity<PagedModel<EntityModel<ChamadoDTO>>> findBySecretaria(String secretaria, Pageable pageable) {
        Page<Chamado> entities = repository.findChamadoBySecretaria(pageable, Secretaria.valueOf(secretaria.toUpperCase()));
        Page<ChamadoDTO> dtos = entities.map(this::convertToDto);
        return ResponseEntity.ok(assembler.toModel(dtos, dto -> EntityModel.of(dto, generateLinks(dto))));
    }

    public ResponseEntity<List<String>> findAllStatus() {
        return ResponseEntity.ok(repository.findAllStatus());
    }

    @Override
    public ResponseEntity<EntityModel<ChamadoDTO>> update(ChamadoDTO dto) {
        checkSecretariaAccess(dto);
        Chamado entity = repository.findById(dto.getId()).orElseThrow(() ->
                new ResourceNotFoundException("Nenhum chamado encontrado."));
        mapper.map(dto, entity);
        ChamadoDTO savedDto = convertToDto(repository.save(entity));
        return ResponseEntity.ok(EntityModel.of(savedDto, generateLinks(savedDto)));
    }

    @Override
    public void deleteById(Long id) {
        Chamado entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum chamado encontrado."));
        checkAccess(entity.getUsuario().getId());
        repository.delete(entity);
    }

    public void checkSecretariaAccess(ChamadoDTO dto) {
        if (dto.getSecretaria() == null) {
            throw new RuntimeException("A secretaria não pode ser atualizada para nula.");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthUser currentAuthUser = (AuthUser) authentication.getPrincipal();
        Funcionario entity = funcionarioRepository.findByAuthUser_Id(currentAuthUser.getId());
        if (Secretaria.valueOf(dto.getSecretaria()) != entity.getSecretaria() && entity.getSecretaria() != Secretaria.ALL) {
            throw new UnauthorizedException("Você não tem permissão para atualizar um recurso nessa secretaria.");
        }
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
