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
import com.elevacon.elevacon.model.Usuario.StatusUsuario;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.security.Roles.UsuarioRole;

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
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();
                    cliente.setContador(contador);

                    Optional<Cliente> clienteExistente = clienteRepository
                            .findByEmailAndUsuarioStatus(cliente.getEmail(), StatusUsuario.INATIVO);

                    if (clienteExistente.isPresent()) {
                        Cliente clienteInativo = clienteExistente.get();
                        clienteInativo.setNome(cliente.getNome());
                        clienteInativo.setCpf(cliente.getCpf());
                        clienteInativo.setTelefone(cliente.getTelefone());
                        clienteInativo.getUsuario().setStatus(StatusUsuario.NOVO);

                        usuarioRepository.save(clienteInativo.getUsuario());
                        return clienteRepository.save(clienteInativo);

                    } else {
                        String senhaTemporaria = UUID.randomUUID().toString().replace("-", "").substring(0, 8);

                        Usuario usuario = new Usuario();
                        usuario.setLogin(cliente.getEmail());
                        usuario.setSenha(passwordEncoder.encode(senhaTemporaria));
                        usuario.setStatus(StatusUsuario.NOVO);
                        usuario.setRole(UsuarioRole.CLIENTE);
                        usuario = usuarioRepository.save(usuario);

                        cliente.setUsuario(usuario);
                        return clienteRepository.save(cliente);
                    }
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
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();

                    List<Usuario.StatusUsuario> statusPermitidos = List.of(
                            Usuario.StatusUsuario.NOVO,
                            Usuario.StatusUsuario.ATIVO);

                    return clienteRepository.findByContadorAndUsuarioStatusIn(contador, statusPermitidos);
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
                        if (clienteExistente.getContador().getIdContador().equals(contador.getIdContador())) {
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

                            System.out.println("Cliente atualizado:" + clienteAtualizado);

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
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();

            if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CONTADOR"))) {
                Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(userDetails.getUsername());

                if (contadorOptional.isPresent()) {
                    Contador contador = contadorOptional.get();
                    Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);

                    if (clienteOptional.isPresent()) {
                        Cliente cliente = clienteOptional.get();

                        // Verifica se o cliente pertence ao contador autenticado
                        if (cliente.getContador().getIdContador().equals(contador.getIdContador())) {
                            // Desativa o usuário associado ao cliente alterando seu status para INATIVO
                            Usuario usuario = cliente.getUsuario();
                            if (usuario != null) {
                                usuario.setStatus(Usuario.StatusUsuario.INATIVO);
                                usuarioRepository.save(usuario);
                            } else {
                                throw new RuntimeException("Usuário associado ao cliente não encontrado.");
                            }
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
                        if (clienteExistente.getContador().getIdContador().equals(contador.getIdContador())) {
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

    public Map<String, String> gerarAcessoParaCliente(String login) {
        Usuario usuario = usuarioRepository.findUsuarioByLogin(login);
        if (usuario == null) {
            throw new RuntimeException("Usuário não encontrado.");
        }
    
        // Log para depuração
        System.out.println("Status do usuário antes de gerar acesso: " + usuario.getStatus());
    
        // Verifica se o usuário está ATIVO ou se não é NOVO
        if (usuario.getStatus() == Usuario.StatusUsuario.ATIVO) {
            throw new RuntimeException("Usuário já está ativo.");
        } else if (usuario.getStatus() != Usuario.StatusUsuario.NOVO) {
            throw new RuntimeException("Geração de acesso permitida apenas para usuários com status 'NOVO'.");
        }
    
        // Gera senha temporária e seta usuário como ATIVO
        String senhaTemporaria = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String senhaCriptografada = passwordEncoder.encode(senhaTemporaria);
        usuario.setSenha(senhaCriptografada);
        usuario.setStatus(Usuario.StatusUsuario.ATIVO);  // Atualiza para ATIVO
    
        usuarioRepository.save(usuario);
    
        System.out.println("Status do usuário após salvar: " + usuario.getStatus());
    
        String linkAcesso = "http://localhost:5173/Login";
        String conteudoEmail = String.format(
                "Olá, %s\n\nSeu acesso ao sistema foi gerado. Use as seguintes credenciais para acessar o sistema:\n\n" +
                "Login: %s\n" +
                "Senha temporária: %s\n\n" +
                "Por favor, para segurança da sua conta acesse o sistema e altere sua senha: %s",
                usuario.getLogin(), usuario.getLogin(), senhaTemporaria, linkAcesso);
    
        emailService.enviarEmail(usuario.getLogin(), "Dados de Acesso", conteudoEmail);
    
        // Informações de login temporárias
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

    public Cliente findByUsuarioId(Long idUsuario) {
        return clienteRepository.findByUsuarioIdUsuario(idUsuario).orElse(null);
    }

}