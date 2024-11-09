package com.elevacon.elevacon.model;

import com.elevacon.elevacon.model.DTOs.ContadorDTO;

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
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "contador")
@Entity(name = "contador")
public class Contador {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contador")
    private Long idContador;

    private String crc;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public Contador(ContadorDTO dados){
        this.idContador = dados.getId_contador();
        this.crc = dados.getCrc();
    }
}
