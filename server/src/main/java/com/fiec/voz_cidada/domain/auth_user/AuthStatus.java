package com.fiec.voz_cidada.domain.auth_user;

public enum AuthStatus {

    SIGNUP("SIGNUP"),
    SIGNIN("SIGNIN");

    private String authStatus;

    AuthStatus(String authType) {
        this.authStatus = authType;
    }

    public String getAuthType() {
        return authStatus;
    }
}