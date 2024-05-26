package com.elevacon.elevacon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.repository.customs.ClienteRepositoryCustom;

public interface ClienteRepository extends JpaRepository<Cliente, Long>, ClienteRepositoryCustom{
    
}
