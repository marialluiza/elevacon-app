package com.elevacon.elevacon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.elevacon.elevacon.model.Documento;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    
}
