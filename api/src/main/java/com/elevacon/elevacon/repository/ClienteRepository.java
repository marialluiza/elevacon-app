package com.elevacon.elevacon.repository;

// import java.util.List;
// import java.util.Optional;

// import org.springframework.data.jpa.repository.JpaRepository;

// import com.elevacon.elevacon.model.Cliente;
// import com.elevacon.elevacon.model.Contador;
// import com.elevacon.elevacon.model.Usuario;

// public interface ClienteRepository extends JpaRepository<Cliente, Long> {

//     List<Cliente> findByContador(Contador contador);

//     // Cliente findByUsuarioId(Long usuarioId);

//     Optional<Cliente> findByUsuario_Id_usuario(Long id_usuario);

//     Optional<Cliente> findByUsuario(Usuario usuario);
// }

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByContador(Contador contador);

    Optional<Cliente> findByUsuarioIdUsuario(Long idUsuario);

    List<Cliente> findByContadorAndUsuarioUsuarioAtivoTrue(Contador contador);

    Optional<Cliente> findByEmailAndUsuarioUsuarioAtivoFalse(String email);

}
