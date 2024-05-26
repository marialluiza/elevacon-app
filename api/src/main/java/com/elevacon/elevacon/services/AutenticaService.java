package com.elevacon.elevacon.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.elevacon.elevacon.repository.UsuarioRepository;

@Service
public class AutenticaService implements UserDetailsService{

    @Autowired
    UsuarioRepository usuarioRepository;

    //método de consulta pro spring security acessar o banco
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       return usuarioRepository.findByLogin(username);
    }
    
}
