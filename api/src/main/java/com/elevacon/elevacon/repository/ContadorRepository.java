package com.elevacon.elevacon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.repository.customs.ContadorRepositoryCustom;


public interface ContadorRepository extends JpaRepository<Contador, Long>, ContadorRepositoryCustom{  
    
    Contador findByUsuarioLogin(String login);
}

