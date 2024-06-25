package com.elevacon.elevacon.services;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.security.Roles.UsuarioRole;

import jakarta.transaction.Transactional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ContadorRepository contadorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Cliente inserirCliente(Cliente cliente) {
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                Contador contador = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                if (contador != null) {
                    cliente.setContador(contador);

                    // Cria o novo usuário para o cliente
                    Usuario usuario = new Usuario();
                    usuario.setLogin(cliente.getEmail()); // ou outro atributo único
                    usuario.setSenha(passwordEncoder.encode("senhaPadrão")); // define uma senha padrão ou gerada
                    usuario.setUsuarioAtivo(false); // desativa o usuário inicialmente
                    usuario.setRole(UsuarioRole.CLIENTE);
                    usuario = usuarioRepository.save(usuario);

                    cliente.setUsuario(usuario);
                    return clienteRepository.save(cliente);
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

    // public Cliente inserirCliente(Cliente cliente) {
    // Authentication usuarioAutenticado =
    // SecurityContextHolder.getContext().getAuthentication();

    // if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal()
    // instanceof UserDetails) {
    // UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

    // if (userDetails.getAuthorities().contains(new
    // SimpleGrantedAuthority("ROLE_CONTADOR"))) {
    // Contador contador =
    // contadorRepository.findByUsuarioLogin(userDetails.getUsername());

    // if (contador != null) {
    // cliente.setContador(contador);
    // return clienteRepository.save(cliente);
    // } else {
    // throw new RuntimeException("Contador não encontrado para o usuário
    // autenticado.");
    // }
    // } else {
    // throw new RuntimeException("Acesso negado: Contador apenas.");
    // }
    // } else {
    // throw new RuntimeException("Usuário autenticado não encontrado.");
    // }
    // }

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
                            clienteExistente.setNome(clienteAtualizado.getNome());
                            clienteExistente.setTelefone(clienteAtualizado.getTelefone());
                            clienteExistente.setEmail(clienteAtualizado.getEmail());
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
                            throw new RuntimeException(
                                    "Acesso negado: O cliente não pertence ao contador autenticado.");
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
                            throw new RuntimeException(
                                    "Acesso negado: O cliente não pertence ao contador autenticado.");
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

    public Cliente buscarClientePorId(Long idCliente) {
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
                            return clienteExistente;
                        } else {
                            throw new RuntimeException(
                                    "Acesso negado: O cliente não pertence ao contador autenticado.");
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

    @Transactional
    public void ativarUsuario(Long clienteId) {
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                Contador contador = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                if (contador != null) {
                    Cliente cliente = clienteRepository.findById(clienteId)
                            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

                    if (cliente.getContador().equals(contador)) {
                        Usuario usuario = cliente.getUsuario();

                        if (usuario != null) {
                            usuario.setUsuarioAtivo(true); // ativa o usuário
                            usuarioRepository.save(usuario);
                        } else {
                            throw new RuntimeException("Usuário não encontrado para o cliente");
                        }
                    } else {
                        throw new RuntimeException("Cliente não pertence ao contador autenticado");
                    }
                } else {
                    throw new RuntimeException("Contador não encontrado para o usuário autenticado");
                }
            } else {
                throw new RuntimeException("Acesso negado: Contador apenas");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado");
        }
    }
}
