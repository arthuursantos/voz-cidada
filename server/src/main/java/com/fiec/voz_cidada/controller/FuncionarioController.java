package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.model.dto.FuncionarioDTO;
import com.fiec.voz_cidada.model.entity.FuncionarioPrefeitura;
import com.fiec.voz_cidada.service.FuncionarioService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/funcionario")
public class FuncionarioController extends GenericController<FuncionarioPrefeitura, FuncionarioDTO, Long> {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        super(service);
        this.service = service;
    }

}