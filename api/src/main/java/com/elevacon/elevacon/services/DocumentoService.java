package com.elevacon.elevacon.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.model.StatusDocumento;
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

import jakarta.transaction.Transactional;

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

        // Diretório de upload
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);

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

        // Nome original do arquivo
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            throw new IllegalArgumentException("Nome do arquivo inválido.");
        }

        // Gera um nome de arquivo único (se já existir, incrementa o sufixo)
        String uniqueFileName = generateUniqueFileName(uploadPath, originalFileName);

        // Caminho final para salvar o arquivo
        Path filePath = uploadPath.resolve(uniqueFileName);

        // Salva o arquivo no diretório de upload
        Files.copy(file.getInputStream(), filePath);

        // Cria e salva a entidade Documento
        Documento documento = new Documento();
        documento.setNome(uniqueFileName);
        documento.setCaminho(filePath.toString());
        documento.setTipoDocumento(tipoDocumentoRepository.findById(tipoDocumentoId).orElseThrow(
                () -> new IllegalArgumentException("Tipo de documento inválido")));
        documento.setDataEnvio(new Date());
        documento.setEnviadoPor((Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        documento.setRecebidoPor(recebidoPor);
        documento.setStatus(StatusDocumento.ENVIADO);

        return documentoRepository.save(documento);
    }


    private String generateUniqueFileName(Path uploadPath, String originalFileName) throws IOException {
        String fileName = originalFileName;
        String baseName = fileName.substring(0, fileName.lastIndexOf('.'));
        String extension = fileName.substring(fileName.lastIndexOf('.'));
        int count = 0;

        while (Files.exists(uploadPath.resolve(fileName))) {
            count++;
            fileName = baseName + "(" + count + ")" + extension;
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

    private static String tokenUsuarioAutenticado;

    public String getTokenUsuarioAutenticado() {
        return tokenUsuarioAutenticado;
    }

    // private void setTokenUsuarioAutenticado(String token) {
    //     tokenUsuarioAutenticado = token;
    // }

    // private boolean isValidFileType(String contentType) {
    //     return contentType.equals("image/jpeg") ||
    //             contentType.equals("image/png") ||
    //             contentType.equals("application/pdf") ||
    //             contentType.equals("text/plain") ||
    //             contentType.equals("application/zip");
    // }

    // lista documentos enviados pelo usuário logado
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

    @Transactional
    public ResponseEntity<Resource> downloadDocumento(Long documentoId) throws IOException {
        // Obtém o usuário autenticado
        Usuario usuarioAutenticado = getUsuarioLogado();
        System.out.println("Usuário autenticado: " + usuarioAutenticado.getId_usuario());

        // Verifica se o documento existe
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado"));

        System.out.println(
                "Documento encontrado. Destinatário do documento: " + documento.getRecebidoPor().getId_usuario());

        // Verifica se o usuário autenticado é o destinatário do documento
        if (!documento.getRecebidoPor().getId_usuario().equals(usuarioAutenticado.getId_usuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        // Obtém o caminho do arquivo
        Path filePath = Paths.get(documento.getCaminho());
        Resource resource = new FileSystemResource(filePath.toFile());

        if (resource.exists()) {
            // Retorna o arquivo como resposta
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null); // ou uma mensagem de erro apropriada
        }
    }
}