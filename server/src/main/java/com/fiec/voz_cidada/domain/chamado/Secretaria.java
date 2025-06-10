package com.fiec.voz_cidada.domain.chamado;

public enum Secretaria {

    OBRAS("OBRAS"),
    URBANISMO("URBANISMO"),
    ALL("ALL");

    private String secretaria;

    Secretaria(String secretaria) {
        this.secretaria = secretaria;
    }

    public String getSecretaria() {
        return secretaria;
    }

}