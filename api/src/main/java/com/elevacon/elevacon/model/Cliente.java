package com.elevacon.elevacon.model;

import java.time.LocalDate;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cliente")
@Entity(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cliente;
    private String nome;
    private String email;
    private String telefone;
    private String titulo_eleitoral;
    private boolean conjugue;
    private String cpf;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data_nascimento;
    private boolean dependente;
    private String ocupacao_principal;
    private String logradouro;
    private int numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
    private String observacao;

    private String nome_conjugue;
    private String cpf_conjugue;

    @ManyToOne
    @JoinColumn(name = "id_contador")
    private Contador contador;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario")
    private Usuario usuario;

}
