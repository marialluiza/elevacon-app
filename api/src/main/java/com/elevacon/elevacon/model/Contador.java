package com.elevacon.elevacon.model;

import com.elevacon.elevacon.model.DTOs.reqContdorDTO;

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
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "contador")
@Entity(name = "contador")
public class Contador {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_contador;

    private String crc;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_pessoa")
    private Pessoa pessoa;

    public Contador(reqContdorDTO dados){
        this.id_contador = dados.id_contador();
        this.crc = dados.crc();
    }
}
