package com.elevacon.elevacon.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.model.DTOs.reqUsuarioDTO;
import com.elevacon.elevacon.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    //método de autenticação

    public Usuario inserirUsuario(@RequestBody reqUsuarioDTO dados) {
        Usuario usuario = new Usuario(dados);
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios(){
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> listarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario atualizarUsuario(Long id, Usuario usuarioAtualizado) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            Usuario usuario = usuarioExistente.get();
            // Atualizar os campos do usuário com os novos valores
            usuario.setLogin(usuarioAtualizado.getLogin());
            usuario.setSenha(usuarioAtualizado.getSenha());
            // usuario.setUsuarioAtivo(false);
            // Salvar o usuário atualizado no repositório
            return usuarioRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuário não encontrado");
        }
    }

    public String removerUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return "Usuário removido com sucesso.";
        } else {
            return "Usuário não encontrado.";
        }
    }
    
}


//-----------------------------------------------------------------------------------------------------
//lógica, regras de negócio
//por exemplo: lógica de conectar 'usuario' 'usuario' com 'contador' 