package com.elevacon.elevacon.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.services.UsuarioService;

@RestController // mapeia como controller
@RequestMapping("/usuario") // endpoints que a classe controla
public class UsuarioController {

    @Autowired // indica ao spring que quando ele for instanciar UsuarioController ele deve
               // colocar as dependências necessárias
    private UsuarioService usuarioService;

    @GetMapping("/listar-usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @GetMapping("/usuario-byId/{id}")
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

    @DeleteMapping("/remover/{id}")
    public ResponseEntity<String> removerUsuario(@PathVariable Long id) {
        try {
            String mensagem = usuarioService.removerUsuario(id);
            return new ResponseEntity<>(mensagem, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
