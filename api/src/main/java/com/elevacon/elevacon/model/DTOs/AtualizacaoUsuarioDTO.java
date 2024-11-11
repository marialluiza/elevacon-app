package com.elevacon.elevacon.model.DTOs;

public class AtualizacaoUsuarioDTO {
    private Long idUsuario;
    private String login;
    private String senha;

    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setId(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
}
