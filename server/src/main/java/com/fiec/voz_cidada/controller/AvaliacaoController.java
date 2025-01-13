package com.fiec.voz_cidada.controller;

import com.fiec.voz_cidada.domain.avaliacao.AvaliacaoDTO;
import com.fiec.voz_cidada.domain.avaliacao.Avaliacao;
import com.fiec.voz_cidada.service.AvaliacaoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/avaliacao")
public class AvaliacaoController extends GenericController<Avaliacao, AvaliacaoDTO, Long> {

    private final AvaliacaoService service;

    public AvaliacaoController(AvaliacaoService service) {
        super(service);
        this.service = service;
    }
}
