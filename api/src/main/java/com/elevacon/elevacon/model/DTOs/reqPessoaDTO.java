package com.elevacon.elevacon.model.DTOs;

public record reqPessoaDTO (
    Long id_pessoa,
    String nome,
    String email,
    String numero_telefone,
    Long id_usuario
){

}
