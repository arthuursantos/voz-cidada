package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.chamado.ChamadoDTO;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.repository.ChamadoRepository;
import com.fiec.voz_cidada.service.ChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/chamado")
public class ChamadoController {

    @Autowired
    private ChamadoService service;

    @PostMapping
    public ResponseEntity<EntityModel<ChamadoDTO>> create(@RequestBody ChamadoDTO dto) {
        EntityModel<ChamadoDTO> entityModel = service.create(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();
        return ResponseEntity.created(location).body(entityModel);
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<ChamadoDTO>>> findAll(@PageableDefault(size = 10) Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<ChamadoDTO>> findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PagedModel<EntityModel<ChamadoDTO>>> findByUserId(@PathVariable Long userId, @PageableDefault(size = 10) Pageable pageable) {
        return service.findByUserId(userId, pageable);
    }

    @GetMapping("/secretaria/{secretaria}")
    public ResponseEntity<PagedModel<EntityModel<ChamadoDTO>>> findBySecretaria(@PathVariable String secretaria, @PageableDefault(size = 10) Pageable pageable) {
        return service.findBySecretaria(secretaria, pageable);
    }

    @GetMapping("/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<String>> findAllStatus() {
        return service.findAllStatus();
    }

    @PutMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<EntityModel<ChamadoDTO>> update(@RequestBody ChamadoDTO dto) {
        return service.update(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}