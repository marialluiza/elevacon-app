package com.elevacon.elevacon.model.DTOs;

import com.elevacon.elevacon.model.Usuario.StatusUsuario;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioDTO {
    private Long idUsuario;
    private String login;
    private String role;
    private StatusUsuario status;

    public UsuarioDTO(Long idUsuario, String login, StatusUsuario status) {
        this.idUsuario = idUsuario;
        this.login = login;
        this.status = status;
    }
}
