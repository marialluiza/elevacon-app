package com.elevacon.elevacon.model.DTOs;

import jakarta.validation.constraints.NotBlank;

public class AlteracaoSenhaDTO {

    private String token;

    @NotBlank(message = "O login não pode estar em branco.")
    private String login;

    @NotBlank(message = "A senha atual não pode estar em branco.")
    private String senhaAtual;

    @NotBlank(message = "A nova senha não pode estar em branco.")
    private String novaSenha;

    public AlteracaoSenhaDTO() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenhaAtual() {
        return senhaAtual;
    }

    public void setSenhaAtual(String senhaAtual) {
        this.senhaAtual = senhaAtual;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }
}
