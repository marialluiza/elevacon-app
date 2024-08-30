package com.elevacon.elevacon.services;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.DTOs.DocumentoDTO;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.DocumentoRepository;
import com.elevacon.elevacon.security.Roles.UsuarioRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentoService {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ContadorRepository contadorRepository;

    // Método auxiliar para verificar o papel do usuário
    private boolean isAdmin() {
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();
        if (usuarioAutenticado != null && usuarioAutenticado.getAuthorities() != null) {
            return usuarioAutenticado.getAuthorities().contains(new SimpleGrantedAuthority(UsuarioRole.ADMIN.getRole()));
        }
        return false;
    }

    public Documento enviarDocumentoParaCliente(Long clienteId, MultipartFile file) throws IOException {
        if (isAdmin()) {
            throw new RuntimeException("Admins não têm permissão para enviar documentos.");
        }

        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();
        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();
            Long contadorId = Long.valueOf(userDetails.getUsername());

            Contador contador = contadorRepository.findById(contadorId)
                    .orElseThrow(() -> new RuntimeException("Contador não encontrado"));

            Cliente cliente = clienteRepository.findById(clienteId)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            if (cliente.getContador().getId_contador().equals(contador.getId_contador())) {
                Documento documento = new Documento();
                documento.setNome(file.getOriginalFilename());
                documento.setTipo(file.getContentType());
                documento.setDados(file.getBytes());
                documento.setCliente(cliente);
                documento.setContador(contador);
                return documentoRepository.save(documento);
            } else {
                throw new RuntimeException("Cliente não pertence ao contador autenticado.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }

    public Documento enviarDocumentoParaContador(Long contadorId, MultipartFile file) throws IOException {
        if (isAdmin()) {
            throw new RuntimeException("Admins não têm permissão para enviar documentos.");
        }

        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();
        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();
            Long clienteId = Long.valueOf(userDetails.getUsername());

            Cliente cliente = clienteRepository.findById(clienteId)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            Contador contador = contadorRepository.findById(contadorId)
                    .orElseThrow(() -> new RuntimeException("Contador não encontrado"));

            if (cliente.getContador().getId_contador().equals(contador.getId_contador())) {
                Documento documento = new Documento();
                documento.setNome(file.getOriginalFilename());
                documento.setTipo(file.getContentType());
                documento.setDados(file.getBytes());
                documento.setCliente(cliente);
                documento.setContador(contador);
                return documentoRepository.save(documento);
            } else {
                throw new RuntimeException("Contador não pertence ao cliente autenticado.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }

    public List<Documento> exibirDocumentosContador(Long contadorId) {
        if (isAdmin()) {
            throw new RuntimeException("Admins não têm permissão para visualizar documentos.");
        }

        Contador contador = contadorRepository.findById(contadorId)
                .orElseThrow(() -> new RuntimeException("Contador não encontrado"));

        return documentoRepository.findByContador(contador);
    }

    public List<Documento> exibirDocumentosContadorID(Long contadorId, Long clienteId) {
        if (isAdmin()) {
            throw new RuntimeException("Admins não têm permissão para visualizar documentos.");
        }

        Contador contador = contadorRepository.findById(contadorId)
                .orElseThrow(() -> new RuntimeException("Contador não encontrado"));

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        return documentoRepository.findByContadorAndCliente(contador, cliente);
    }

    public List<Documento> exibirDocumentosCliente(Long clienteId) {
        if (isAdmin()) {
            throw new RuntimeException("Admins não têm permissão para visualizar documentos.");
        }

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        return documentoRepository.findByCliente(cliente);
    }

    public byte[] downloadDocumentosRecebidoDoContador(Long contadorId, Long documentoId) {
        if (isAdmin()) {
            throw new RuntimeException("Admins não têm permissão para baixar documentos.");
        }

        Contador contador = contadorRepository.findById(contadorId)
                .orElseThrow(() -> new RuntimeException("Contador não encontrado"));

        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));

        if (!documento.getContador().getId_contador().equals(contador.getId_contador())) {
            throw new RuntimeException("Documento não pertence ao contador especificado.");
        }

        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();
        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();
            Long clienteId = Long.valueOf(userDetails.getUsername());

            Cliente cliente = clienteRepository.findById(clienteId)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            if (documento.getCliente().getId_cliente().equals(cliente.getId_cliente())) {
                return documento.getDados();
            } else {
                throw new RuntimeException("Documento não pertence ao cliente autenticado.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }

    public byte[] downloadDocumentosRecebidoDoCliente(Long clienteId, Long documentoId) {
        if (isAdmin()) {
            throw new RuntimeException("Admins não têm permissão para baixar documentos.");
        }

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));

        if (!documento.getCliente().getId_cliente().equals(cliente.getId_cliente())) {
            throw new RuntimeException("Documento não pertence ao cliente especificado.");
        }

        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();
        if (usuarioAutenticado != null && usuarioAutenticado.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) usuarioAutenticado.getPrincipal();
            Long contadorId = Long.valueOf(userDetails.getUsername());

            Contador contador = contadorRepository.findById(contadorId)
                    .orElseThrow(() -> new RuntimeException("Contador não encontrado"));

            if (documento.getContador().getId_contador().equals(contador.getId_contador())) {
                return documento.getDados();
            } else {
                throw new RuntimeException("Documento não pertence ao contador autenticado.");
            }
        } else {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }
    }
}