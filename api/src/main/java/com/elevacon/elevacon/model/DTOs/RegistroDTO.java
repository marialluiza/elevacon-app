package com.elevacon.elevacon.model.DTOs;

import com.elevacon.elevacon.security.Roles.UsuarioRole;

public record RegistroDTO(
    String login,
    String senha,
    UsuarioRole role) {
    
}
