package com.elevacon.elevacon.model;

import com.elevacon.elevacon.model.DTOs.reqPessoaDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pessoa")
@Entity(name = "pessoa")
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_pessoa;

    @Column(nullable = false)
    private String nome;

    private String email;

    private String numero_telefone;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_contador")
    private Contador contador;

    public Pessoa(reqPessoaDTO dados) {
        this.id_pessoa = dados.id_pessoa();
        this.nome = dados.nome();
        this.email = dados.email();
        this.numero_telefone = dados.numero_telefone();
    }

}