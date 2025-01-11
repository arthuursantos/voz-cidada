package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.model.dto.ChamadoDTO;
import com.fiec.voz_cidada.model.entity.Chamado;
import com.fiec.voz_cidada.service.ChamadoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chamado")
public class ChamadoController extends GenericController<Chamado, ChamadoDTO, Long> {

    private final ChamadoService service;

    public ChamadoController(ChamadoService service) {
        super(service);
        this.service = service;
    }

}
