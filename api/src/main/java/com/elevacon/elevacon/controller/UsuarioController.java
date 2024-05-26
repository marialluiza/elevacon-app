package com.elevacon.elevacon.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.elevacon.elevacon.model.Usuario;
// import com.elevacon.elevacon.model.DTOs.reqUsuarioDTO;
import com.elevacon.elevacon.services.UsuarioService;

@RestController // mapeia como controller
@RequestMapping("/usuario") // endpoints que a classe controla
public class UsuarioController {

    @Autowired // indica ao spring que quando ele for instanciar UsuarioController ele deve colocar as dependências necessárias
    private UsuarioService usuarioService;

    @GetMapping("/listar-usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // @PostMapping("/cadastrar-usuario")
    // public ResponseEntity<Usuario> inserirUsuario(@RequestBody reqUsuarioDTO dados) {
    //     Usuario usuario = usuarioService.inserirUsuario(dados);
    //     return new ResponseEntity<>(usuario, HttpStatus.CREATED);
    // }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> buscarUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuarioOptional = usuarioService.listarUsuarioPorId(id);
        if (usuarioOptional.isPresent()) {
            return new ResponseEntity<>(usuarioOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("atualiza/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
        Usuario usuario = usuarioService.atualizarUsuario(id, usuarioAtualizado);
        return ResponseEntity.ok(usuario);
    }

    
}
