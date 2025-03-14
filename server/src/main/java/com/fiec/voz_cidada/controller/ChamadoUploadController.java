package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.chamado.ChamadoDTO;
import com.fiec.voz_cidada.service.ChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/chamado/upload")
public class ChamadoUploadController {

    @Autowired
    private ChamadoService service;

    @Value("${app.upload.dir:/app/uploads}")
    private String uploadDir;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<UrlResource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            UrlResource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<EntityModel<ChamadoDTO>> createWithImage(ChamadoDTO dto) {
        service.checkUserAccess(dto.getUsuarioId());
        if (dto.getFotoAntesFile() != null && !dto.getFotoAntesFile().isEmpty()) {
            if (!dto.getFotoAntesFile().getContentType().startsWith("image/")) {
                throw new IllegalArgumentException("Apenas arquivos de imagem são permitidos.");
            }
            String fotoAntesUrl = saveImage(dto.getFotoAntesFile());
            dto.setFotoAntesUrl("teste");
        }

        EntityModel<ChamadoDTO> entityModel = service.create(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(entityModel.getContent().getId())
                .toUri();

        return ResponseEntity.created(location).body(entityModel);
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            return baseUrl + "/api/chamado/upload/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar imagem: " + e.getMessage(), e);
        }
    }
}