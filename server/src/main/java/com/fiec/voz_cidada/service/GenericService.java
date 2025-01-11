package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.repository.GenericRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;

public abstract class GenericService<T, D extends RepresentationModel<D>, ID extends Serializable> {

    private final GenericRepository<T, ID> repository;
    private final Class<D> dtoClass;
    private final Class<T> entityClass;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private PagedResourcesAssembler<D> assembler;

    protected GenericService(GenericRepository<T, ID> repository, Class<D> dtoClass, Class<T> entityClass) {
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
                .orElseThrow(() -> new RuntimeException("Not found"));
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
                new EntityNotFoundException("Entity with ID " + id + " not found"));
        mapper.map(dto, existingEntity);
        D savedDto = convertToDto(repository.save(existingEntity));
        return EntityModel.of(savedDto, generateLinks(savedDto));
    }

    public void deleteById(ID id) {
        repository.deleteById(id);
    }

    protected D convertToDto(T entity) {
        return mapper.map(entity, dtoClass);
    }

    protected T convertToEntity(D dto) {
        return mapper.map(dto, entityClass);
    }

    protected abstract Link[] generateLinks(D dto);

    public abstract ID getResourceID(D dto);
}