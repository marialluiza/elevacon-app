package com.elevacon.elevacon.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.model.DTOs.AutenticaDTO;
import com.elevacon.elevacon.model.DTOs.LoginTokenDTO;
import com.elevacon.elevacon.model.DTOs.reqUsuarioDTO;
import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.services.TokenService;

@RestController
@RequestMapping("autentica")
public class AutenticaController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AutenticaDTO dados){
        //hash para criptografar senha
        var loginSenha = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        var autentica = this.authenticationManager.authenticate(loginSenha);

        var token = tokenService.geraToken((Usuario)autentica.getPrincipal());

        return ResponseEntity.ok(new LoginTokenDTO(token));
    }

    @PostMapping("/cadastrar")
    public ResponseEntity cadastrar(@RequestBody @Valid reqUsuarioDTO dados){
        if (this.usuarioRepository.findByLogin(dados.login()) != null) return ResponseEntity.badRequest().build();
            
        String senhaCriptografada = new BCryptPasswordEncoder().encode(dados.senha());
        Usuario novoUsuario = new Usuario(dados.login(), senhaCriptografada, dados.dataCriacao(),dados.role());

        this.usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok().build();
    }

    // @PostMapping("/cadastrar")
    // public ResponseEntity cadastrar(@RequestBody @Valid RegistroDTO dados){
    //     if (this.usuarioRepository.findByLogin(dados.login()) != null) return ResponseEntity.badRequest().build();
            
    //     String senhaCriptografada = new BCryptPasswordEncoder().encode(dados.senha());
    //     Usuario novoUsuario = new Usuario(dados.login(), senhaCriptografada, dados.role());

    //     this.usuarioRepository.save(novoUsuario);

    //     return ResponseEntity.ok().build();
    // }
}
