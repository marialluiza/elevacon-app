package com.elevacon.elevacon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.repository.customs.ClienteRepositoryCustom;

public interface ClienteRepository extends JpaRepository<Cliente, Long>, ClienteRepositoryCustom{
    List<Cliente> findByContador(Contador contador);
    
}
