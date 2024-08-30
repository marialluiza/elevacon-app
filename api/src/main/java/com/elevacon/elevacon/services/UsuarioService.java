package com.elevacon.elevacon.services;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.model.DTOs.reqUsuarioDTO;
import com.elevacon.elevacon.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // @Autowired
    // private AutenticaService autenticaService;

    public Usuario inserirUsuario(@RequestBody reqUsuarioDTO dados) {
        Usuario usuario = new Usuario(dados);
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> listarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario atualizarUsuario(Long id, Usuario usuarioAtualizado) {
        Authentication autenticado = SecurityContextHolder.getContext().getAuthentication(); // autenticado fornece o contexto do usuario autenticado
        String usuarioAtual = autenticado.getName();

        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            Usuario usuario = usuarioExistente.get();

            if (usuarioPode(usuarioAtual, usuario)) {
                // atualiza os campos do usuário com os novos valores:
                usuario.setLogin(usuarioAtualizado.getLogin());
                String senhaCriptografada = new BCryptPasswordEncoder().encode(usuarioAtualizado.getSenha());
                usuario.setSenha(senhaCriptografada);
                return usuarioRepository.save(usuario); // slva o usuário atualizado no repositório
            } else {
                throw new AccessDeniedException("Usuário não possui permissão.");
            }

        } else {
            throw new RuntimeException("Usuário não encontrado");
        }

    }

    public String removerUsuario(Long id) {
        Authentication autenticado = SecurityContextHolder.getContext().getAuthentication();
        String usuarioAtual = autenticado.getName();

        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            Usuario usuario = usuarioExistente.get();

            if (usuarioPode(usuarioAtual, usuario)) {
                usuarioRepository.deleteById(id);
                return "Usuário removido com sucesso.";
            } else {
                throw new AccessDeniedException("Usuário não possui permissão.");
            }

        } else {
            return "Usuário não encontrado.";
        }
    }


    private boolean usuarioPode(String atualUsuario, Usuario usuario) {
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

        for (GrantedAuthority autorizacao : authorities) {
            String role = autorizacao.getAuthority();
            if (role.equals("ROLE_ADMIN")) {
                return true;

            } else if (role.equals("ROLE_CONTADOR")) {
                if (atualUsuario.equals(usuario.getLogin())) {
                    return true;
                }
            } else if (role.equals("ROLE_CLIENTE")) {
                if (atualUsuario.equals(usuario.getLogin())) {
                    return true;
                }
            } else if (role.equals("ROLE_USUARIO")) {
                if (atualUsuario.equals(usuario.getLogin())) {
                    return true;
                }
            }
        }
        System.out.println("Não possui permissão para realizar essa ação referente a este usuário.");
        return false;
    }

    private boolean usuarioPodeDocumento(String atualUsuario, Usuario usuario) {
        // Obtém as authorities do usuário autenticado
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

        // Verifica se o usuário possui a role permitida
        for (GrantedAuthority autorizacao : authorities) {
            String role = autorizacao.getAuthority();

            // Apenas os roles CONTADOR e CLIENTE podem realizar ações
            if (role.equals("ROLE_CONTADOR") || role.equals("ROLE_CLIENTE")) {
                if (atualUsuario.equals(usuario.getLogin())) {
                    return true; // O contador ou cliente pode realizar ações se for o próprio usuário
                }
            }
        }

        System.out.println("Não possui permissão para realizar essa ação.");
        return false; // Caso o usuário não tenha permissão
    }
}



// -----------------------------------------------------------------------------------------------------
// lógica, regras de negócio