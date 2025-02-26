package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.historico.HistoricoDTO;
import com.fiec.voz_cidada.domain.historico.HistoricoChamado;
import com.fiec.voz_cidada.service.HistoricoService;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController extends GenericController<HistoricoChamado, HistoricoDTO, Long> {

    private final HistoricoService service;

    public HistoricoController(HistoricoService service) {
        super(service);
        this.service = service;
    }

}
