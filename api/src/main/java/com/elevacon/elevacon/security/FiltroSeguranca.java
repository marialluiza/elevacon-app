package com.elevacon.elevacon.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.services.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class FiltroSeguranca extends OncePerRequestFilter{

    @Autowired
    TokenService tokenService;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recuperaToken(request);
        if (token != null) {
            var login = tokenService.validaToken(token);
            if (login != null) {
                UserDetails usuario = usuarioRepository.findByLogin(login);
                if (usuario != null) {
                    var autenticacao = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(autenticacao);
                    System.out.println("Usuário autenticado: " + login);
                } else {
                    System.out.println("Usuário não encontrado para o login: " + login);
                }
            } else {
                System.out.println("Token inválido: " + token);
            }
        } 
        filterChain.doFilter(request, response); // Chama o próximo filtro
    }
    
    private String recuperaToken(HttpServletRequest request){
        var cabecalhoAutenticacao = request.getHeader("Authorization");
        if (cabecalhoAutenticacao == null) {
            return null;

        }else{
            return cabecalhoAutenticacao.replace("Bearer ", ""); // bearer é uma padronização que o spring aplica, logo ele está sendo substituido por um valor vazio pra que apenas o token seja pego.
        }
    }
}
