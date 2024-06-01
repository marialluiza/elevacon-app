// package com.elevacon.elevacon.model.DTOs;

// public record LoginTokenDTO(
//         String token,
//         Long id_usuario,
//         String login,
//         String role) {

//     public LoginTokenDTO(String token, Long id_usuario, String login, String role) {
//         this.token = token;
//         this.id_usuario = id_usuario;
//         this.login = login;
//         this.role = role;
//     }


// }

package com.elevacon.elevacon.model.DTOs;

import com.elevacon.elevacon.security.Roles.UsuarioRole;

public class LoginTokenDTO {
    private String token;
    private Long id_usuario;
    private String login;
    private UsuarioRole role;

    public LoginTokenDTO(String token, Long id_usuario, String login, UsuarioRole role) {
        this.token = token;
        this.id_usuario = id_usuario;
        this.login = login;
        this.role = role;
    }

    // Getters e Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public UsuarioRole getRole() {
        return role;
    }

    public void setRole(UsuarioRole role) {
        this.role = role;
    }
}
