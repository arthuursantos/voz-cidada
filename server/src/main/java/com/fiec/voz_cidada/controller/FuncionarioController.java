package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.funcionario.FuncionarioDTO;
import com.fiec.voz_cidada.domain.funcionario.Funcionario;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.swing.text.html.parser.Entity;
import java.net.URI;

@RestController
@RequestMapping("/api/funcionario")
public class FuncionarioController {

    @Autowired
    private FuncionarioService service;

    @PostMapping()
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<EntityModel<FuncionarioDTO>> create(@RequestBody FuncionarioDTO dto) {
        EntityModel<FuncionarioDTO> model = service.createAdminProfile(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(service.getResourceID(model.getContent()))
                .toUri();
        return ResponseEntity.created(location).body(model);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<PagedModel<EntityModel<FuncionarioDTO>>> findAll(@PageableDefault(size = 10) Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<FuncionarioDTO>> findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/auth/{authUserId}")
    public ResponseEntity<EntityModel<FuncionarioDTO>> findByAuthUserId(@PathVariable Long authUserId) {
        return ResponseEntity.ok(service.findByAuthUserId(authUserId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}