package com.elevacon.elevacon.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;

@Service
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ContadorRepository contadorRepository;

        public Cliente inserirCliente(Cliente cliente) {
        Long idContador = cliente.getContador().getId_contador();
        Optional<Contador> contadorOptional = contadorRepository.findById(idContador);
        if (contadorOptional.isPresent()) {
            Contador contador = contadorOptional.get();
            cliente.setContador(contador);
            return clienteRepository.save(cliente);
        } else {
            throw new RuntimeException("Contador com o ID fornecido não encontrado.");
        }
    }

        public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }
}
