package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.chamado.ChamadoDTO;
import com.fiec.voz_cidada.domain.chamado.Secretaria;
import com.fiec.voz_cidada.domain.funcionario.Funcionario;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.exceptions.UnauthorizedException;
import com.fiec.voz_cidada.repository.GenericRepository;
import com.fiec.voz_cidada.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.swing.text.html.parser.Entity;
import java.io.Serializable;

public abstract class GenericService<T, D extends RepresentationModel<D>, ID extends Serializable> {

    private final GenericRepository<T, ID> repository;
    private final Class<D> dtoClass;
    private final Class<T> entityClass;

    @Autowired
    protected ModelMapper mapper;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    protected PagedResourcesAssembler<D> assembler;

    protected GenericService(
            GenericRepository<T, ID> repository,
            Class<D> dtoClass,
            Class<T> entityClass
    ) {
        this.repository = repository;
        this.dtoClass = dtoClass;
        this.entityClass = entityClass;
    }

    public ResponseEntity<PagedModel<EntityModel<D>>> findAll(Pageable pageable) {
        Page<T> entities = repository.findAll(pageable);
        Page<D> dtos = entities.map(this::convertToDto);
        return ResponseEntity.ok(assembler.toModel(dtos, dto -> EntityModel.of(dto, generateLinks(dto))));
    }

    public ResponseEntity<EntityModel<D>> findById(ID id) {
        EntityModel<D> model = repository.findById(id)
                .map(this::convertToDto)
                .map(dto -> EntityModel.of(dto, generateLinks(dto)))
                .orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado."));
        return ResponseEntity.ok(model);
    }

    public EntityModel<D> create(D dto) {
        T entity = convertToEntity(dto);
        T savedEntity = repository.save(entity);
        D savedDto = convertToDto(savedEntity);
        return EntityModel.of(savedDto, generateLinks(savedDto));
    }

    public ResponseEntity<EntityModel<D>> update(D dto) {
        ID id = getResourceID(dto);
        T existingEntity = repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Nenhum recurso com ID " + id + " encontrado."));
        mapper.map(dto, existingEntity);
        D savedDto = convertToDto(repository.save(existingEntity));
        return ResponseEntity.ok(EntityModel.of(savedDto, generateLinks(savedDto)));
    }

    @Transactional
    public void delete(ID id) {
        repository.deleteById(id);
    }

    public void checkAccess(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Usuário não autenticado.");
        }
        AuthUser currentAuthUser = (AuthUser) authentication.getPrincipal();

        if (currentAuthUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return;
        }

        Usuario entity = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        if (!entity.getAuthUser().getId().equals(currentAuthUser.getId())) {
            throw new UnauthorizedException("Você não tem permissão para acessar este recurso.");
        }
    }


    public D convertToDto(T entity) {
        return mapper.map(entity, dtoClass);
    }

    public T convertToEntity(D dto) {
        return mapper.map(dto, entityClass);
    }

    protected abstract Link[] generateLinks(D dto);

    public abstract ID getResourceID(D dto);
}