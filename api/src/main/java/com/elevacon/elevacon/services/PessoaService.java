package com.elevacon.elevacon.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Pessoa;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.PessoaRepository;

@Service
public class PessoaService {

    @Autowired
    private ContadorRepository contadorRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    public Pessoa inserirPessoa(Pessoa pessoa) {
        Long idContador = pessoa.getContador().getId_contador();
        Optional<Contador> contadorOptional = contadorRepository.findById(idContador);
        if (contadorOptional.isPresent()) {
            Contador contador = contadorOptional.get();
            pessoa.setContador(contador);
            return pessoaRepository.save(pessoa);
        } else {
            throw new RuntimeException("Contador com o ID fornecido não encontrado.");
        }
    }

    public List<Pessoa> listarPessoas() {
        return pessoaRepository.findAll();
    }

}
