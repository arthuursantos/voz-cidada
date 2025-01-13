package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.usuario.UsuarioDTO;
import com.fiec.voz_cidada.domain.usuario.Usuario;
import com.fiec.voz_cidada.service.UsuarioService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController extends GenericController<Usuario, UsuarioDTO, Long> {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        super(service);
        this.service = service;
    }

}
