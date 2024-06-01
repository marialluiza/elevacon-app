package com.elevacon.elevacon.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ContadorRepository contadorRepository;

    public Cliente inserirCliente(Cliente cliente) {
        Long idContador = cliente.getContador().getId_contador();
        Optional<Contador> contadorOptional = contadorRepository.findById(idContador);
        if (contadorOptional.isPresent()) {
            Contador contador = contadorOptional.get();
            cliente.setContador(contador);
            return clienteRepository.save(cliente);
        } else {
            throw new RuntimeException("Contador com o ID fornecido não encontrado.");
        }
    }

    public List<Cliente> listarClientes() {
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                Contador contador = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                if (contador != null) {
                    return clienteRepository.findByContador(contador);
                } else {
                    throw new RuntimeException("Contador não encontrado para o usuário autenticado.");
                }
            } else {
                throw new RuntimeException("Acesso negado: Contador apenas.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }

    public Cliente editarCliente(Long idCliente, Cliente clienteAtualizado) {
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                Contador contador = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                if (contador != null) {
                    Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);
                    if (clienteOptional.isPresent()) {
                        Cliente clienteExistente = clienteOptional.get();
                        if (clienteExistente.getContador().getId_contador().equals(contador.getId_contador())) {
                            clienteExistente.setTitulo_eleitoral(clienteAtualizado.getTitulo_eleitoral());
                            clienteExistente.setConjugue(clienteAtualizado.isConjugue());
                            clienteExistente.setCpf(clienteAtualizado.getCpf());
                            clienteExistente.setData_nascimento(clienteAtualizado.getData_nascimento());
                            clienteExistente.setDependente(clienteAtualizado.isDependente());
                            clienteExistente.setOcupacao_principal(clienteAtualizado.getOcupacao_principal());
                            clienteExistente.setNome_conjugue(clienteAtualizado.getNome_conjugue());
                            clienteExistente.setCpf_conjugue(clienteAtualizado.getCpf_conjugue());
                            clienteExistente.setUsuario(clienteAtualizado.getUsuario());
                            clienteExistente.setPessoa(clienteAtualizado.getPessoa());
                            return clienteRepository.save(clienteExistente);
                        } else {
                            throw new RuntimeException("Acesso negado: O cliente não pertence ao contador autenticado.");
                        }
                    } else {
                        throw new RuntimeException("Cliente com o ID fornecido não encontrado.");
                    }
                } else {
                    throw new RuntimeException("Contador não encontrado para o usuário autenticado.");
                }
            } else {
                throw new RuntimeException("Acesso apenas para contadores.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }

    public void excluirCliente(Long idCliente) {
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                Contador contador = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                if (contador != null) {
                    Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);
                    if (clienteOptional.isPresent()) {
                        Cliente cliente = clienteOptional.get();
                        if (cliente.getContador().getId_contador().equals(contador.getId_contador())) {
                            clienteRepository.delete(cliente);
                        } else {
                            throw new RuntimeException("Acesso negado: O cliente não pertence ao contador autenticado.");
                        }
                    } else {
                        throw new RuntimeException("Cliente com o ID fornecido não encontrado.");
                    }
                } else {
                    throw new RuntimeException("Contador não encontrado para o usuário autenticado.");
                }
            } else {
                // throw new RuntimeException("Acesso negado: Contador apenas.");
                throw new RuntimeException("Acesso apenas para contadores.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }

}
