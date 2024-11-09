package com.elevacon.elevacon.model.DTOs;

import java.time.LocalDate;
import java.util.Date;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
// @NoArgsConstructor
public class ClienteDTO {

    private Long id_cliente;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "O nome não pode ter mais de 100 caracteres")
    private String nome;

    @Email(message = "Email deve ser válido")
    @NotBlank(message = "Email é obrigatório")
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    private String titulo_eleitoral;

    @NotNull(message = "O campo 'conjugue' é obrigatório")
    private boolean conjugue;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotNull(message = "Data de nascimento é obrigatória")
    private LocalDate data_nascimento;

    private boolean dependente;

    private String ocupacao_principal;

    @NotBlank(message = "Logradouro é obrigatório")
    private String logradouro;

    @NotNull(message = "Número é obrigatório")
    private int numero;

    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
    private String observacao;

    private String nome_conjugue;
    private String cpf_conjugue;

    private Long id_contador;
    private Long id_usuario;

    private Contador contador;

    public ClienteDTO(Cliente cliente) {
        this.nome = cliente.getNome();
        this.id_cliente = cliente.getId_cliente();
        this.nome = cliente.getNome();
        this.email = cliente.getEmail();
        this.telefone = cliente.getTelefone();
        this.titulo_eleitoral = cliente.getTitulo_eleitoral();
        this.cpf = cliente.getCpf();
        this.data_nascimento = cliente.getData_nascimento();
        this.ocupacao_principal = cliente.getOcupacao_principal();
        this.logradouro = cliente.getLogradouro();
        this.numero = cliente.getNumero();
        this.bairro = cliente.getBairro();
        this.cidade = cliente.getCidade();
        this.estado = cliente.getEstado();
        this.cep = cliente.getCep();
        this.observacao = cliente.getObservacao();
        this.nome_conjugue = cliente.getNome_conjugue();
        this.cpf_conjugue = cliente.getCpf_conjugue();
        this.id_contador = cliente.getContador().getIdContador();
        this.id_usuario = cliente.getUsuario().getIdUsuario();
        this.contador = cliente.getContador();
    }

}