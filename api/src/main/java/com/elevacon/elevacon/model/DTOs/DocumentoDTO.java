package com.elevacon.elevacon.model.DTOs;

public class DocumentoDTO {
    private String nomeDocumento;
    private String tipoDocumento;
    private Long idUsuario;
    private String nomeUsuario;

    // Construtor
    public DocumentoDTO(String nomeDocumento, String tipoDocumento, Long idUsuario, String nomeUsuario) {
        this.nomeDocumento = nomeDocumento;
        this.tipoDocumento = tipoDocumento;
        this.idUsuario = idUsuario;
        this.nomeUsuario = nomeUsuario;
    }

    public DocumentoDTO() {
    }


    public String getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNomeDocumento() {
        return nomeDocumento;
    }

    public void setNomeDocumento(String nomeDocumento) {
        this.nomeDocumento = nomeDocumento;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }
}
