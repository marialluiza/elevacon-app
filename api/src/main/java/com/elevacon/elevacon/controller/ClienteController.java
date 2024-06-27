package com.elevacon.elevacon.controller;

import java.util.List;

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
// import com.elevacon.elevacon.model.Usuario;
// import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.services.ClienteService;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // @Autowired
    // private UsuarioRepository usuarioRepository;

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
            System.out.println("Cliente com o id " + id + " foi excluído com sucesso");
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

}
