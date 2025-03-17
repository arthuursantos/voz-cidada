package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.domain.auth_user.AuthUser;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.Serializable;

public abstract class GenericService<T, D extends RepresentationModel<D>, ID extends Serializable> {

    private final GenericRepository<T, ID> repository;
    private final Class<D> dtoClass;
    private final Class<T> entityClass;

    @Autowired
    private ModelMapper mapper;
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


    public PagedModel<EntityModel<D>> findAll(Pageable pageable) {
        Page<T> entities = repository.findAll(pageable);
        Page<D> dtos = entities.map(this::convertToDto);
        return assembler.toModel(dtos, dto -> EntityModel.of(dto, generateLinks(dto)));
    }

    public EntityModel<D> findById(ID id) {
        return repository.findById(id)
                .map(this::convertToDto)
                .map(dto -> EntityModel.of(dto, generateLinks(dto)))
                .orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado."));
    }

    public EntityModel<D> create(D dto) {
        T entity = convertToEntity(dto);
        T savedEntity = repository.save(entity);
        D savedDto = convertToDto(savedEntity);
        return EntityModel.of(savedDto, generateLinks(savedDto));
    }

    public EntityModel<D> update(D dto) {
        ID id = getResourceID(dto);
        T existingEntity = repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Nenhum recurso com ID " + id + " encontrado."));
        mapper.map(dto, existingEntity);
        D savedDto = convertToDto(repository.save(existingEntity));
        return EntityModel.of(savedDto, generateLinks(savedDto));
    }

    @Transactional
    public void deleteById(ID id) {
        repository.deleteById(id);
    }

    public void checkUserAccess(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Usuário não autenticado.");
        }
        AuthUser currentAuthUser = (AuthUser) authentication.getPrincipal();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            Usuario entity = usuarioRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
            if (!entity.getAuthUser().getId().equals(currentAuthUser.getId())) {
                throw new UnauthorizedException("Você não tem permissão para acessar este recurso.");
            }
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