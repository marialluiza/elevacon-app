package com.elevacon.elevacon.model.DTOs;

import com.elevacon.elevacon.model.Usuario.StatusUsuario;
import com.elevacon.elevacon.security.Roles.UsuarioRole;

import java.util.Date;

public record reqUsuarioDTO(
        Long id_usuario,
        String login,
        String senha,
        StatusUsuario status,
        Date dataCriacao, 
        UsuarioRole role){

}
