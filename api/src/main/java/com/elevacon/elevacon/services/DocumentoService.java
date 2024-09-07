package com.elevacon.elevacon.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.model.StatusDocumento;
import com.elevacon.elevacon.model.TipoDocumento;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.DocumentoRepository;
import com.elevacon.elevacon.repository.TipoDocumentoRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DocumentoService {

    @Autowired
    private ContadorRepository contadorRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    private final DocumentoRepository documentoRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;

    public DocumentoService(DocumentoRepository documentoRepository, TipoDocumentoRepository tipoDocumentoRepository) {
        this.documentoRepository = documentoRepository;
        this.tipoDocumentoRepository = tipoDocumentoRepository;
    }

    public Documento uploadDocumento(MultipartFile file, Long tipoDocumentoId, Usuario recebidoPor) throws IOException {

        // Obtém o usuário autenticado e suas credenciais
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();
        if (usuarioAutenticado == null || !(usuarioAutenticado.getPrincipal() instanceof Usuario)) {
            throw new IllegalArgumentException("Usuário não autenticado ou inválido.");
        }

        Usuario enviadoPor = (Usuario) usuarioAutenticado.getPrincipal();
        String token = usuarioAutenticado.getCredentials() != null ? usuarioAutenticado.getCredentials().toString()
                : "Token não disponível";
        setTokenUsuarioAutenticado(token);

        // Validação de tipo de arquivo
        String contentType = file.getContentType();
        if (!isValidFileType(contentType)) {
            throw new IllegalArgumentException("Tipo de arquivo não suportado");
        }

        // Validação do tipo de documento
        TipoDocumento tipoDocumento = tipoDocumentoRepository.findById(tipoDocumentoId)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de documento inválido"));

        // Verifica se o usuário autenticado é contador ou cliente
        Optional<Contador> contadorOptional = contadorRepository.findByUsuarioLogin(enviadoPor.getLogin());
        Optional<Cliente> clienteOptional = clienteRepository.findByUsuario(enviadoPor);

        if (contadorOptional.isPresent()) {
            validarEnvioDeContador(contadorOptional.get(), recebidoPor);
        } else if (clienteOptional.isPresent()) {
            validarEnvioDeCliente(clienteOptional.get(), recebidoPor);
        } else {
            throw new IllegalArgumentException("Usuário autenticado não é um cliente nem um contador.");
        }

        // Processo de upload de arquivo
        String fileName = processarUpload(file);

        // Cria e salva a entidade Documento
        Documento documento = new Documento();
        documento.setNome(fileName);
        documento.setCaminho("uploads/" + fileName);
        documento.setTipoDocumento(tipoDocumento);
        documento.setDataEnvio(new Date());
        documento.setEnviadoPor(enviadoPor);
        documento.setRecebidoPor(recebidoPor);
        documento.setStatus(StatusDocumento.ENVIADO);

        return documentoRepository.save(documento);
    }

    // Método auxiliar para validar envio de contador
    private void validarEnvioDeContador(Contador contadorAutenticado, Usuario recebidoPor) {
        Optional<Cliente> clienteDestino = clienteRepository.findByUsuario(recebidoPor);
        if (!clienteDestino.isPresent()) {
            throw new IllegalArgumentException("O usuário destino não é um cliente.");
        }

        Cliente cliente = clienteDestino.get();
        if (!cliente.getContador().getId_contador().equals(contadorAutenticado.getId_contador())) {
            throw new IllegalArgumentException(
                    "Você não pode enviar documentos para um cliente que não está associado a você.");
        }
    }

    // Método auxiliar para validar envio de cliente
    private void validarEnvioDeCliente(Cliente clienteAutenticado, Usuario recebidoPor) {
        Optional<Contador> contadorDestino = contadorRepository.findByUsuario(recebidoPor);
        if (!contadorDestino.isPresent()) {
            throw new IllegalArgumentException("O usuário destino não é um contador.");
        }

        Contador contador = contadorDestino.get();
        if (!clienteAutenticado.getContador().getId_contador().equals(contador.getId_contador())) {
            throw new IllegalArgumentException(
                    "Você não pode enviar documentos para um contador que não está associado a você.");
        }
    }

    // Método auxiliar para processar o upload do arquivo
    private String processarUpload(MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path path = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), path);

        return fileName;
    }

    // Armazena o token do usuário autenticado (simulação)
    private static String tokenUsuarioAutenticado;

    public String getTokenUsuarioAutenticado() {
        return tokenUsuarioAutenticado;
    }

    private void setTokenUsuarioAutenticado(String token) {
        tokenUsuarioAutenticado = token;
    }

    private boolean isValidFileType(String contentType) {
        return contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("application/pdf") ||
                contentType.equals("text/plain") ||
                contentType.equals("application/zip");
    }

    // Listar documentos enviados pelo usuário logado
    public List<Documento> listarDocumentosEnviados() {
        Usuario usuarioLogado = getUsuarioLogado();
        return documentoRepository.findByEnviadoPor(usuarioLogado);
    }

    // Listar documentos recebidos pelo usuário logado
    public List<Documento> listarDocumentosRecebidos() {
        Usuario usuarioLogado = getUsuarioLogado();
        return documentoRepository.findByRecebidoPor(usuarioLogado);
    }

    // Método utilitário para obter o usuário logado
    private Usuario getUsuarioLogado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Usuario) {
            return (Usuario) auth.getPrincipal();
        }
        throw new IllegalArgumentException("Usuário não autenticado");
    }
}