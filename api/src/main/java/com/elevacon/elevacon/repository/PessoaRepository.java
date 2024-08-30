package com.elevacon.elevacon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elevacon.elevacon.model.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Long>{

}