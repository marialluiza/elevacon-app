package com.elevacon.elevacon.services;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.UsuarioRepository;

import java.util.Date;

@Service
public class AutenticaService implements UserDetailsService {

    @Autowired
    UsuarioRepository usuarioRepository;

    // método de consulta pro spring security acessar o banco
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByLogin(username);
    }

    public Long getUsuarioLogado() {
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails instanceof Usuario) {
                Usuario usuario = (Usuario) userDetails;
                return usuario.getId_usuario();
            } else {
                throw new RuntimeException("Usuário autenticado não é uma instância de Usuario.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }

    // public String gerarToken(Usuario usuario) {
    //     String secret = System.getenv("${api.security.token.secret}"); 

    //     return JWT.create()
    //             .withSubject(usuario.getLogin())
    //             .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
    //             .sign(Algorithm.HMAC256(secret));
    // }
}
