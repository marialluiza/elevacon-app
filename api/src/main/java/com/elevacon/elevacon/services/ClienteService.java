package com.elevacon.elevacon.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailService emailService;

    public Cliente inserirCliente(Cliente cliente) {
        // Obtém o usuário autenticado
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            // Verifica se o usuário tem a role ROLE_CONTADOR
            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                // Obtém o contador associado ao usuário autenticado
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                // Se o contador estiver presente
                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();
                    cliente.setContador(contador);

                    // Gera uma senha temporária
                    String senhaTemporaria = UUID.randomUUID().toString().replace("-",
                            "").substring(0, 8);

                    Usuario usuario = new Usuario();
                    usuario.setLogin(cliente.getEmail());
                    usuario.setSenha(passwordEncoder.encode(senhaTemporaria));
                    usuario.setUsuarioAtivo(false);
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

    public List<Cliente> listarClientes() {
        // Obtém o usuário autenticado
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            // Verifica se o usuário tem a role ROLE_CONTADOR
            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                // Obtém o contador associado ao usuário autenticado
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                // Se o contador estiver presente
                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();
                    // Retorna a lista de clientes associados ao contador
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
        // Obtém o usuário autenticado
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            // Verifica se o usuário tem a role ROLE_CONTADOR
            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                // Obtém o contador associado ao usuário autenticado
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                // Se o contador estiver presente
                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();

                    // Obtém o cliente pelo ID
                    Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);

                    // Se o cliente estiver presente
                    if (clienteOptional.isPresent()) {
                        Cliente clienteExistente = clienteOptional.get();

                        // Verifica se o cliente pertence ao contador autenticado
                        if (clienteExistente.getContador().getId_contador().equals(contador.getId_contador())) {
                            // Atualiza os dados do cliente
                            clienteExistente.setNome(clienteAtualizado.getNome());
                            clienteExistente.setTelefone(clienteAtualizado.getTelefone());
                            clienteExistente.setEmail(clienteAtualizado.getEmail());
                            clienteExistente.setTitulo_eleitoral(clienteAtualizado.getTitulo_eleitoral());
                            clienteExistente.setConjugue(clienteAtualizado.isConjugue());
                            clienteExistente.setCpf(clienteAtualizado.getCpf());
                            clienteExistente.setData_nascimento(clienteAtualizado.getData_nascimento());
                            clienteExistente.setDependente(clienteAtualizado.isDependente());
                            clienteExistente.setOcupacao_principal(clienteAtualizado.getOcupacao_principal());
                            clienteExistente.setLogradouro(clienteAtualizado.getLogradouro());
                            clienteExistente.setNumero(clienteAtualizado.getNumero());
                            clienteExistente.setBairro(clienteAtualizado.getBairro());
                            clienteExistente.setCidade(clienteAtualizado.getCidade());
                            clienteExistente.setEstado(clienteAtualizado.getEstado());
                            clienteExistente.setCep(clienteAtualizado.getCep());
                            clienteExistente.setNome_conjugue(clienteAtualizado.getNome_conjugue());
                            clienteExistente.setCpf_conjugue(clienteAtualizado.getCpf_conjugue());
                            clienteExistente.setUsuario(clienteAtualizado.getUsuario());
                            clienteExistente.setPessoa(clienteAtualizado.getPessoa());

                            // Salva e retorna o cliente atualizado
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
        // Obtém o usuário autenticado
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            // Verifica se o usuário tem a role ROLE_CONTADOR
            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                // Obtém o contador associado ao usuário autenticado
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                // Se o contador estiver presente
                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();

                    // Obtém o cliente pelo ID
                    Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);

                    // Se o cliente estiver presente
                    if (clienteOptional.isPresent()) {
                        Cliente cliente = clienteOptional.get();

                        // Verifica se o cliente pertence ao contador autenticado
                        if (cliente.getContador().getId_contador().equals(contador.getId_contador())) {
                            // Exclui o cliente
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
                throw new RuntimeException("Acesso apenas para contadores.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }

    public Cliente buscarClientePorId(Long idCliente) {
        // Obtém o usuário autenticado
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            // Verifica se o usuário tem a role ROLE_CONTADOR
            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                // Obtém o contador associado ao usuário autenticado
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                // Se o contador estiver presente
                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();

                    // Obtém o cliente pelo ID
                    Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);

                    // Se o cliente estiver presente
                    if (clienteOptional.isPresent()) {
                        Cliente clienteExistente = clienteOptional.get();

                        // Verifica se o cliente pertence ao contador autenticado
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
        // Obtém o usuário autenticado
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            // Verifica se o usuário tem a role ROLE_CONTADOR
            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                // Obtém o contador associado ao usuário autenticado
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                // Se o contador estiver presente
                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();

                    // Obtém o cliente pelo ID
                    Cliente cliente = clienteRepository.findById(clienteId)
                            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

                    // Verifica se o cliente pertence ao contador autenticado
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

    public Map<String, String> gerarAcessoParaCliente(String login) {
        Usuario usuario = usuarioRepository.findUsuarioByLogin(login);
        if (usuario == null) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        if (usuario.isUsuarioAtivo()) {
            throw new RuntimeException("Usuário já está ativo.");
        }

        String senhaTemporaria = UUID.randomUUID().toString().replace("-",
                "").substring(0, 8);

        String senhaCriptografada = passwordEncoder.encode(senhaTemporaria);
        usuario.setSenha(senhaCriptografada);
        // usuario.setUsuarioAtivo(true);

        usuarioRepository.save(usuario);

        String linkAcesso = "http://localhost:5173/Login";
        String conteudoEmail = String.format(
                "Olá, %s\n\nSeu acesso ao sistema foi gerado. Use as seguintes credenciais para acessar o sistema:\n\n"
                        +
                        "Login: %s\n" +
                        "Senha temporária: %s\n\n" +
                        "Por favor, para segurança da sua conta acesse o sistema e altere sua senha:%s",
                usuario.getLogin(), usuario.getLogin(), senhaTemporaria, linkAcesso);

        emailService.enviarEmail(usuario.getLogin(), "Dados de Acesso",
                conteudoEmail);

        Map<String, String> loginInfo = new HashMap<>();
        loginInfo.put("login", usuario.getLogin());
        loginInfo.put("senhaTemporaria", senhaTemporaria);

        return loginInfo;
    }

    public void alterarSenha(String token, String novaSenha) {
        String login = tokenService.getLoginFromToken(token);
        Usuario usuario = usuarioRepository.findUsuarioByLogin(login);

        if (usuario != null) {
            usuario.setSenha(passwordEncoder.encode(novaSenha));
            usuarioRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuário não encontrado ou inativo.");
        }
    }

    // public Cliente findByUsuarioId(Long usuarioId) {
    //     return clienteRepository.findByUsuario_Id_usuario(usuarioId).orElse(null);
    // }

}