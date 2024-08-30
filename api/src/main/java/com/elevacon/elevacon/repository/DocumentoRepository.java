package com.elevacon.elevacon.repository;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    List<Documento> findByCliente(Cliente cliente);
    List<Documento> findByContador(Contador contador);

    List<Documento> findByContadorAndCliente(Contador contador, Cliente cliente);

}
