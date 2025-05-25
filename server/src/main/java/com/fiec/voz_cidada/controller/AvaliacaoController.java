package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.avaliacao.AvaliacaoDTO;
import com.fiec.voz_cidada.service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
    
@RestController
@RequestMapping("/api/avaliacao")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService service;

    @PostMapping
    public ResponseEntity<EntityModel<AvaliacaoDTO>> create(@RequestBody AvaliacaoDTO dto) {
        EntityModel<AvaliacaoDTO> entityModel = service.create(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();
        return ResponseEntity.created(location).body(entityModel);
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<AvaliacaoDTO>>> findAll(@PageableDefault(size = 10) Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<AvaliacaoDTO>> findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping
    public ResponseEntity<EntityModel<AvaliacaoDTO>> update(@RequestBody AvaliacaoDTO dto) {
        return service.update(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


}