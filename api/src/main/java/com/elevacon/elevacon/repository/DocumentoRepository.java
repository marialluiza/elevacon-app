package com.elevacon.elevacon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.model.Usuario;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    // Lista os documentos onde o usuário autenticado é quem enviou
    List<Documento> findByEnviadoPor(Usuario enviadoPor);

    // Lista os documentos onde o usuário autenticado é quem recebeu
    List<Documento> findByRecebidoPor(Usuario recebidoPor);

}
