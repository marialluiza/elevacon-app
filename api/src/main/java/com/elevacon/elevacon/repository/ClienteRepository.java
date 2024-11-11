package com.elevacon.elevacon.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Usuario;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByContador(Contador contador);

    Optional<Cliente> findByUsuarioIdUsuario(Long idUsuario);

    Optional<Cliente> findByUsuarioLogin(String login);

    Optional<Cliente> findByEmailAndUsuarioStatus(String email, Usuario.StatusUsuario status);

    List<Cliente> findByContadorAndUsuarioStatusIn(Contador contador, List<Usuario.StatusUsuario> status);

}
