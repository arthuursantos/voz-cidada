package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.usuario.Usuario;
import com.fiec.voz_cidada.domain.usuario.UsuarioDTO;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.exceptions.UnauthorizedException;
import com.fiec.voz_cidada.service.UsuarioService;
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
@RequestMapping("/api/usuario")
public class UsuarioController extends GenericController<Usuario, UsuarioDTO, Long> {

    private UsuarioService service;

    public UsuarioController(UsuarioService service) {
        super(service);
        this.service = service;
    }

    @Override
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<UsuarioDTO>>> findAll(
            @PageableDefault(size = 10) Pageable pageable) {
        try {
            return ResponseEntity.ok(service.findAll(pageable));
        } catch (Exception e) {
            throw new UnauthorizedException("Você não tem permissão para acessar este recurso.");
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<UsuarioDTO>> findById(@PathVariable Long id) {
        service.checkAccess(id);
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/auth/{authUserId}")
    public ResponseEntity<EntityModel<UsuarioDTO>> findByAuthUserId(@PathVariable Long authUserId) {
        try {
            var entity = service.findByAuthUserId(authUserId);
            service.checkAccess(entity.getContent().getId());
            return ResponseEntity.ok(entity);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<EntityModel<UsuarioDTO>> create(@RequestBody UsuarioDTO dto) {
        EntityModel<UsuarioDTO> entityModel = service.createUserProfile(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(service.getResourceID(entityModel.getContent()))
                .toUri();
        return ResponseEntity.created(location).body(entityModel);
    }

    @Override
    @PutMapping
    public ResponseEntity<EntityModel<UsuarioDTO>> update(@RequestBody UsuarioDTO dto) {
        service.checkAccess(dto.getId());
        EntityModel<UsuarioDTO> entityModel = service.update(dto);
        return ResponseEntity.ok(entityModel);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.checkAccess(id);
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}