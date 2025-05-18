package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.historico.HistoricoDTO;
import com.fiec.voz_cidada.domain.historico.HistoricoChamado;
import com.fiec.voz_cidada.service.HistoricoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    @Autowired
    HistoricoService service;

    @PostMapping
    public ResponseEntity<EntityModel<HistoricoDTO>> create(@RequestBody HistoricoDTO dto) {
        EntityModel<HistoricoDTO> entityModel = service.create(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(service.getResourceID(entityModel.getContent()))
                .toUri();
        return ResponseEntity.created(location).body(entityModel);
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<HistoricoDTO>>> findAll(@PageableDefault(size = 10) Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<HistoricoDTO>> findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping
    public ResponseEntity<EntityModel<HistoricoDTO>> update(@RequestBody HistoricoDTO dto) {
        return service.update(dto);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}