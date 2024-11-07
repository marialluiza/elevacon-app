package com.elevacon.elevacon.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.DTOs.AlteracaoSenhaDTO;
import com.elevacon.elevacon.model.DTOs.ClienteDTO;
import com.elevacon.elevacon.services.ClienteService;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/cadastrar-cliente")
    public ResponseEntity<Cliente> inserirCliente(@RequestBody Cliente cliente) {
        Cliente novoCliente = clienteService.inserirCliente(cliente);
        return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
    }

    @GetMapping("/listar-clientes")
    public List<Cliente> listarClientes() {
        return clienteService.listarClientes();
    }

    @PutMapping("/editar-cliente/{id}")
    public ResponseEntity<Cliente> editarCliente(@PathVariable Long id, @RequestBody Cliente clienteAtualizado) {
        try {
            Cliente clienteEditado = clienteService.editarCliente(id, clienteAtualizado);
            return new ResponseEntity<>(clienteEditado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/excluir-cliente/{id}")
    public ResponseEntity<Void> excluirCliente(@PathVariable Long id) {
        try {
            clienteService.excluirCliente(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/buscar-cliente/{id}")
    public ResponseEntity<Cliente> buscarClientePorId(@PathVariable Long id) {
        try {
            Cliente cliente = clienteService.buscarClientePorId(id);
            return new ResponseEntity<>(cliente, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{clienteId}/ativar-usuario")
    public ResponseEntity<?> ativarUsuario(@PathVariable Long clienteId) {
        clienteService.ativarUsuario(clienteId);
        return ResponseEntity.ok("Usuário ativado com sucesso");
    }

    @PostMapping("/gerar-acesso")
    public ResponseEntity<Map<String, String>> gerarAcesso(@RequestBody Map<String, String> payload) {
        try {
            String login = payload.get("login");

            Map<String, String> loginInfo = clienteService.gerarAcessoParaCliente(login);

            return ResponseEntity.ok(loginInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/alterar-senha")
    public ResponseEntity<String> alterarSenha(@RequestBody AlteracaoSenhaDTO alteracaoSenhaDTO) {
        try {
            clienteService.alterarSenha(alteracaoSenhaDTO.getToken(), alteracaoSenhaDTO.getNovaSenha());
            return ResponseEntity.ok("Senha alterada com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao alterar a senha: " + e.getMessage());
        }
    }

    @GetMapping("/cliente-logado/{id_usuario}")
    public ResponseEntity<ClienteDTO> getClienteByUsuarioId(@PathVariable Long id_usuario) {
        Cliente cliente = clienteService.findByUsuarioId(id_usuario);
        if (cliente != null) {
            return ResponseEntity.ok(new ClienteDTO(cliente));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}


