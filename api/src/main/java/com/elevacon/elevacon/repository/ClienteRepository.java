package com.elevacon.elevacon.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByContador(Contador contador);

    // Cliente findByUsuarioId(Long usuarioId);

    // Optional<Cliente> findByUsuario_Id_usuario(Long id_usuario);

}
