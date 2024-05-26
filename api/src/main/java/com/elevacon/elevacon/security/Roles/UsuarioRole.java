package com.elevacon.elevacon.security.Roles;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public enum UsuarioRole {
    
    ADMIN("admin"),
    USUARIO("usuario"),
    CONTADOR("contador"),
    CLIENTE("cliente");

    private String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    

}
