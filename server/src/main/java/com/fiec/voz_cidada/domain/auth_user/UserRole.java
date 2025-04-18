package com.fiec.voz_cidada.domain.auth_user;

public enum UserRole {
    OWNER("owner"),
    ADMIN("admin"),
    USER("user");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}