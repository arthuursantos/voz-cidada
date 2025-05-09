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
public class ChamadoController extends GenericController<Chamado, ChamadoDTO, Long> {

    private final ChamadoRepository repository;

    @Autowired
    private ChamadoService service;

    public ChamadoController(ChamadoService service, ChamadoRepository repository) {
        super(service);
        this.repository = repository;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PagedModel<EntityModel<ChamadoDTO>>> findByUserId(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.findByUserId(userId, pageable));
    }

    @GetMapping("/secretaria/{secretaria}")
    public ResponseEntity<PagedModel<EntityModel<ChamadoDTO>>> findBySecretaria(
            @PathVariable String secretaria,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.findBySecretaria(secretaria, pageable));
    }

    @GetMapping("/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<String>> findAllStatus() {
        List<String> status = repository.findAllStatus();
        return ResponseEntity.ok(status);
    }

    @Override
    @PutMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<EntityModel<ChamadoDTO>> update(@RequestBody ChamadoDTO dto) {
        EntityModel<ChamadoDTO> entityModel = service.update(dto);
        return ResponseEntity.ok(entityModel);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Chamado entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível excluir os dados. O chamado não foi encontrado."));
        service.checkAccess(entity.getUsuario().getId());
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PostMapping
    public ResponseEntity<EntityModel<ChamadoDTO>> create(@RequestBody ChamadoDTO dto) {
        service.checkAccess(dto.getUsuarioId());
        EntityModel<ChamadoDTO> entityModel = service.create(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();
        return ResponseEntity.created(location).body(entityModel);
    }

}