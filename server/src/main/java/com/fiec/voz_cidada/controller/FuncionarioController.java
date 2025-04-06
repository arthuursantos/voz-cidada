package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.funcionario.FuncionarioDTO;
import com.fiec.voz_cidada.domain.funcionario.Funcionario;
import com.fiec.voz_cidada.exceptions.UnauthorizedException;
import com.fiec.voz_cidada.service.FuncionarioService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/funcionario")
public class FuncionarioController extends GenericController<Funcionario, FuncionarioDTO, Long> {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        super(service);
        this.service = service;
    }

    @Override
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<PagedModel<EntityModel<FuncionarioDTO>>> findAll(
            @PageableDefault(size = 10) Pageable pageable) {
        try {
            return ResponseEntity.ok(service.findAll(pageable));
        } catch (Exception e) {
            throw new UnauthorizedException("Você não tem permissão para acessar este recurso.");
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<FuncionarioDTO>> findById(@PathVariable Long id) {
        service.checkUserAccess(id);
        return ResponseEntity.ok(service.findById(id));
    }

    @Override
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

}