package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.chamado.ChamadoDTO;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.repository.ChamadoRepository;
import com.fiec.voz_cidada.service.ChamadoService;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/chamado")
public class ChamadoController extends GenericController<Chamado, ChamadoDTO, Long> {

    private final ChamadoRepository repository;

    public ChamadoController(ChamadoService service, ChamadoRepository repository) {
        super(service);
        this.repository = repository;
    }

    @Override
    @PutMapping
    public ResponseEntity<EntityModel<ChamadoDTO>> update(@RequestBody ChamadoDTO dto) {
        service.validateUserAccess(dto.getUsuarioId());
        EntityModel<ChamadoDTO> entityModel = service.update(dto);
        return ResponseEntity.ok(entityModel);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Chamado entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível excluir os dados. O chamado não foi encontrado."));
        service.validateUserAccess(entity.getUsuario().getId());
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PostMapping
    public ResponseEntity<EntityModel<ChamadoDTO>> create(@RequestBody ChamadoDTO dto) {
        service.validateUserAccess(dto.getUsuarioId());
        EntityModel<ChamadoDTO> entityModel = service.create(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();
        return ResponseEntity.created(location).body(entityModel);
    }

}