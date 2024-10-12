package com.elevacon.elevacon.model.DTOs;

import java.util.Date;

import com.elevacon.elevacon.model.Documento;

import lombok.Data;

@Data
public class DocumentoDTO {

    private Long id;
    private String nome;
    private String caminho;
    private String tipoDocumento;
    private String enviadoPor;
    private String recebidoPor;
    private Date dataEnvio;

    // Construtor que converte a entidade Documento em DTO
    public DocumentoDTO(Documento documento) {
        this.id = documento.getId();
        this.nome = documento.getNome();
        this.caminho = documento.getCaminho();
        this.tipoDocumento = documento.getTipoDocumento().getNome(); // Adapte conforme o modelo de TipoDocumento
        this.enviadoPor = documento.getEnviadoPor().getLogin(); // Ou ID, depende da necessidade
        this.recebidoPor = documento.getRecebidoPor().getLogin(); // Ou ID
        this.dataEnvio = documento.getDataEnvio();
    }

}
