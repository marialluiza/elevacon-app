package com.elevacon.elevacon.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "documento")
@Entity(name = "documento")

public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_documento;

    private String nome;
    private String tipo;

    @Lob
    private byte[] dados;

    @ManyToOne
    @JoinColumn(name = "remetente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "destinatario_id")
    private  Contador contador;

}
