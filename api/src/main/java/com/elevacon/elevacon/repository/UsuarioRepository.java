package com.elevacon.elevacon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.security.core.userdetails.UserDetails;

import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.customs.UsuarioRepositoryCustom;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>, UsuarioRepositoryCustom {

    UserDetails findByLogin(String login);

}
