package com.elevacon.elevacon.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.repository.customs.ContadorRepositoryCustom;

public interface ContadorRepository extends JpaRepository<Contador, Long>, ContadorRepositoryCustom {

    Optional<Contador> findByUsuarioLogin(String login);

    // Optional<Contador> findByUsuario(Usuario usuario);

    Optional<Contador> findByUsuarioIdUsuario(Long idUsuario);

}
