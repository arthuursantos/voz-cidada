package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.avaliacao.AvaliacaoDTO;
import com.fiec.voz_cidada.domain.avaliacao.Avaliacao;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.domain.chamado.ChamadoDTO;
import com.fiec.voz_cidada.repository.AvaliacaoRepository;
import com.fiec.voz_cidada.repository.ChamadoRepository;
import com.fiec.voz_cidada.repository.UsuarioRepository;
import com.fiec.voz_cidada.service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/avaliacao")
public class AvaliacaoController extends GenericController<Avaliacao, AvaliacaoDTO, Long> {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;
    @Autowired
    private ChamadoRepository chamadoRepository;

    public AvaliacaoController(AvaliacaoService service) {
        super(service);
    }

    @Override
    @PutMapping
    public ResponseEntity<EntityModel<AvaliacaoDTO>> update(@RequestBody AvaliacaoDTO dto) {
        Avaliacao entity = avaliacaoRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("A avaliação não existe."));
        service.validateUserAccess(entity.getUsuario().getId());
        EntityModel<AvaliacaoDTO> entityModel = service.update(dto);
        return ResponseEntity.ok(entityModel);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Avaliacao entity = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("A avaliação não existe."));
        service.validateUserAccess(entity.getUsuario().getId());
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PostMapping
    public ResponseEntity<EntityModel<AvaliacaoDTO>> create(@RequestBody AvaliacaoDTO dto) {
        Chamado entity = chamadoRepository.findById(dto.getChamadoId())
                .orElseThrow(() -> new RuntimeException("Não é possível avaliar um chamado que não existe."));
        service.validateUserAccess(entity.getUsuario().getId());
        service.validateUserAccess(dto.getUsuarioId());
        EntityModel<AvaliacaoDTO> entityModel = service.create(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();
        return ResponseEntity.created(location).body(entityModel);
    }

}
