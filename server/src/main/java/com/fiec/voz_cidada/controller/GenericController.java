package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.service.GenericService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.Serializable;
import java.net.URI;

public abstract class GenericController<T, D extends RepresentationModel<D>, ID extends Serializable> {

    protected final GenericService<T, D, ID> service;

    protected GenericController(GenericService<T, D, ID> service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<D>>> findAll(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<D>> findById(@PathVariable ID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<EntityModel<D>> create(@RequestBody D dto) {
        EntityModel<D> entityModel = service.create(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(service.getResourceID(entityModel.getContent()))
                .toUri();
        return ResponseEntity.created(location).body(entityModel);
    }

    @PutMapping
    public ResponseEntity<EntityModel<D>> update(@RequestBody D dto) {
        EntityModel<D> entityModel = service.update(dto);
        return ResponseEntity.ok(entityModel);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
