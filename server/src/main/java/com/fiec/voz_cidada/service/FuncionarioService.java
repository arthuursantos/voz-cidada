package com.fiec.voz_cidada.service;

import com.fiec.voz_cidada.controller.FuncionarioController;
import com.fiec.voz_cidada.domain.auth_user.AuthUser;
import com.fiec.voz_cidada.domain.funcionario.FuncionarioDTO;
import com.fiec.voz_cidada.domain.funcionario.Funcionario;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import com.fiec.voz_cidada.domain.usuario.UsuarioDTO;
import com.fiec.voz_cidada.exceptions.ResourceNotFoundException;
import com.fiec.voz_cidada.exceptions.UnauthorizedException;
import com.fiec.voz_cidada.repository.AuthRepository;
import com.fiec.voz_cidada.repository.FuncionarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FuncionarioService extends GenericService<Funcionario, FuncionarioDTO, Long> {

    @Autowired
    private FuncionarioRepository repository;

    @Autowired
    private AuthRepository authRepository;

    public FuncionarioService(FuncionarioRepository repository) {
        super(repository, FuncionarioDTO.class, Funcionario.class);
    }

    @Override
    protected Link[] generateLinks(FuncionarioDTO dto) {
        return new Link[] {
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FuncionarioController.class)
                        .findById(dto.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FuncionarioController.class)
                        .findAll(Pageable.unpaged())).withRel("funcionarios"),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(FuncionarioController.class)
                        .delete(dto.getId())).withRel("delete")
        };
    }

    @Override
    public void checkUserAccess(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Usuário não autenticado.");
        }
        AuthUser currentAuthUser = (AuthUser) authentication.getPrincipal();

        Funcionario entity = repository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        if (!entity.getAuthUser().getId().equals(currentAuthUser.getId())) {
            throw new UnauthorizedException("Você não tem permissão para acessar este recurso.");
        }
    }

    @Transactional
    public EntityModel<FuncionarioDTO> findByAuthUserId(Long authUserId) {
        try {
            var entity = repository.findByAuthUser_Id(authUserId);
            var dto = convertToDto(entity);
            return EntityModel.of(dto, generateLinks(dto));
        } catch (Exception e) {
            throw new ResourceNotFoundException("Nenhum usuário autenticado encontrado.");
        }
    }

    @Override
    public Long getResourceID(FuncionarioDTO dto) {
        return dto.getId();
    }

    public EntityModel<FuncionarioDTO> createAdminProfile(FuncionarioDTO dto) {
        AuthUser authUser = authRepository.findById(dto.getAuthId())
                .orElseThrow(() -> new ResourceNotFoundException("Você não está autenticado. Crie uma conta antes de prosseguir."));
        System.out.println(dto);
        Funcionario entity = convertToEntity(dto);
        entity.setAuthUser(authUser);
        entity.setDataCadastro(LocalDateTime.now());
        FuncionarioDTO savedDto = convertToDto(repository.save(entity));
        return EntityModel.of(savedDto, generateLinks(savedDto));
    }
}
