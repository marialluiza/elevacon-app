package com.elevacon.elevacon.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.UsuarioRepository;

@Service
public class ContadorService {

    @Autowired
    private ContadorRepository contadorRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public Contador cadastrarContador(Contador contador) {
        Long idUsuario = contador.getUsuario().getId_usuario();
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(idUsuario);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            contador.setUsuario(usuario);
            return contadorRepository.save(contador);
        } else {
            throw new RuntimeException("Usuário com o ID fornecido não encontrado.");
        }
    }
    public List<Contador> listarContadores() {
        return contadorRepository.findAll();
    }
}
