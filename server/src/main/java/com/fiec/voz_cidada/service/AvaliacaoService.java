package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.AvaliacaoController;
import com.fiec.voz_cidada.domain.avaliacao.AvaliacaoDTO;
import com.fiec.voz_cidada.domain.avaliacao.Avaliacao;
import com.fiec.voz_cidada.domain.chamado.Chamado;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.repository.AvaliacaoRepository;
import com.fiec.voz_cidada.repository.ChamadoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AvaliacaoService extends GenericService<Avaliacao, AvaliacaoDTO, Long> {

    @Autowired
    private AvaliacaoRepository repository;

    @Autowired
    private ChamadoRepository chamadoRepository;

    public AvaliacaoService(AvaliacaoRepository repository) {
        super(repository, AvaliacaoDTO.class, Avaliacao.class);
    }

    @Override
    public EntityModel<AvaliacaoDTO> create(AvaliacaoDTO dto) {
        Chamado entity = chamadoRepository.findById(dto.getChamadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível avaliar. O chamado não existe."));
        if (!"CONCLUÍDO".equalsIgnoreCase(entity.getStatus())) {
            throw new RuntimeException("Não é possível avaliar um chamado que não esteja concluído.");
        }
        if (repository.existsByChamadoId(dto.getChamadoId())) {
            throw new RuntimeException("O chamado só pode ser avaliado uma vez.");
        }
        checkAccess(entity.getUsuario().getId());
        checkAccess(dto.getUsuarioId());

        Avaliacao savedEntity = repository.save(convertToEntity(dto));
        StackTraceElement currentMethod = Thread.currentThread().getStackTrace()[1];
        String logMsg = "Avaliação criada. ID " + savedEntity.getId();
        log.info("{} > {} > {}", currentMethod.getClassName(), currentMethod.getMethodName(), logMsg);

        return EntityModel.of(convertToDto(savedEntity), generateLinks(dto));
    }

    @Override
    public ResponseEntity<EntityModel<AvaliacaoDTO>> update(AvaliacaoDTO dto) {
        Avaliacao entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("A avaliação não existe."));
        checkAccess(entity.getChamado().getUsuario().getId());
        checkAccess(dto.getUsuarioId());
        mapper.map(dto, entity);

        AvaliacaoDTO savedDto = convertToDto(repository.save(entity));
        StackTraceElement currentMethod = Thread.currentThread().getStackTrace()[1];
        String logMsg = "Avaliação atualizada. ID " + savedDto.getId();
        log.info("{} > {} > {}", currentMethod.getClassName(), currentMethod.getMethodName(), logMsg);

        return ResponseEntity.ok(EntityModel.of(savedDto));
    }

    @Override
    public void delete(Long id) {
        Avaliacao entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("A avaliação não existe."));
        checkAccess(entity.getUsuario().getId());
        repository.delete(entity);
    }

    @Override
    protected Link[] generateLinks(AvaliacaoDTO dto) {
        return new Link[] {
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AvaliacaoController.class)
                        .findById(dto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AvaliacaoController.class)
                        .findAll(Pageable.unpaged())).withRel("avaliacoes"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AvaliacaoController.class)
                        .delete(dto.getId())).withRel("delete")
        };
    }

    @Override
    public Long getResourceID(AvaliacaoDTO dto) {
        return dto.getId();
    }
}
