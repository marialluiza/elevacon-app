package com.elevacon.elevacon.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.customs.UsuarioRepositoryCustom;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>, UsuarioRepositoryCustom {

    //está sendo declarado aqui com 'UserDetails' para utilização do Spring Security .
    UserDetails findByLogin(String login);
}
//métodos basicos com o banco 
//custom: métodos diferentes de busca: desativar por id
//impl: select 