package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.UsuarioController;
import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.usuario.UsuarioDTO;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.repository.AuthRepository;
import com.fiec.voz_cidada.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService extends GenericService<Usuario, UsuarioDTO, Long> {

    private final UsuarioRepository usuarioRepository;
    private final AuthRepository authRepository;

    public UsuarioService(
            UsuarioRepository repository,
            UsuarioRepository usuarioRepository,
            AuthRepository authRepository)
    {
        super(repository, UsuarioDTO.class, Usuario.class);
        this.usuarioRepository = usuarioRepository;
        this.authRepository = authRepository;
    }

    public EntityModel<UsuarioDTO> createUserProfile(UsuarioDTO dto) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthUser currentAuthUser = (AuthUser) authentication.getPrincipal();
        AuthUser authUser = authRepository.findById(currentAuthUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Você não está autenticado. Crie uma conta antes de prosseguir."));
        Usuario entity = convertToEntity(dto);
        entity.setAuthUser(authUser);
        UsuarioDTO savedDto = convertToDto(usuarioRepository.save(entity));
        return EntityModel.of(savedDto, generateLinks(savedDto));
    }

    @Transactional
    public ResponseEntity<EntityModel<UsuarioDTO>> findByAuthUserId(Long authUserId) {
        try {
            var entity = usuarioRepository.findByAuthUser_Id(authUserId);
            var dto = convertToDto(entity);
            return ResponseEntity.ok(EntityModel.of(dto, generateLinks(dto)));
        } catch (Exception e) {
            throw new ResourceNotFoundException("Nenhum usuário autenticado encontrado.");
        }
    }

    @Transactional
    @Override
    public void delete(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        authRepository.deleteById(usuario.getAuthUser().getId());
        usuarioRepository.delete(usuario);
    }

    @Override
    protected Link[] generateLinks(UsuarioDTO dto) {
        return new Link[] {
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UsuarioController.class)
                        .findById(dto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UsuarioController.class)
                        .findAll(Pageable.unpaged())).withRel("usuarios"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UsuarioController.class)
                        .delete(dto.getId())).withRel("delete")
        };
    }

    @Override
    public Long getResourceID(UsuarioDTO dto) {
        return dto.getId();
    }

}
