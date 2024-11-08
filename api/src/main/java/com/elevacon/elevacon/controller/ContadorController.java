package com.elevacon.elevacon.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.DTOs.ContadorDTO;
import com.elevacon.elevacon.services.ContadorService;

@RestController
@RequestMapping("/contador")
public class ContadorController{
    
    @Autowired
    private ContadorService contadorService;

    @GetMapping("/listar-contadores")
    public List<Contador> listaContadors(){
        return contadorService.listarContadores();
    }

    @PostMapping("/cadastrar-contador")
    public ResponseEntity<Contador> cadastrarContador(@RequestBody Contador contador){
        Contador novContador = contadorService.cadastrarContador(contador);
        return new ResponseEntity<>(novContador, HttpStatus.CREATED);
    }

    @GetMapping("/contador-logado/{id_usuario}")
    public ResponseEntity<ContadorDTO> getContadorByUsuarioId(@PathVariable Long id_usuario) {
        Contador contador = contadorService.findByUsuarioId(id_usuario);
        if (contador != null) {
            return ResponseEntity.ok(new ContadorDTO(contador));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}