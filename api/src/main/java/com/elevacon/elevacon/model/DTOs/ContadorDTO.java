package com.elevacon.elevacon.model.DTOs;

import com.elevacon.elevacon.model.Contador;

public class ContadorDTO {

    private Long id_contador;
    private String crc;
    private Long id_usuario;

    public ContadorDTO(Long id_contador, String crc, Long id_usuario) {
        this.id_contador = id_contador;
        this.crc = crc;
        this.id_usuario = id_usuario;
    }

    public Long getId_contador() {
        return id_contador;
    }

    public void setId_contador(Long id_contador) {
        this.id_contador = id_contador;
    }

    public String getCrc() {
        return crc;
    }

    public void setCrc(String crc) {
        this.crc = crc;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public ContadorDTO(Contador contador) {
        this.id_contador = contador.getIdContador();
        this.crc = contador.getCrc();
        this.id_usuario = contador.getUsuario() != null ? contador.getUsuario().getIdUsuario() : null;
    }
}
