package com.elevacon.elevacon.services;

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

import jakarta.transaction.Transactional;

@Service
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final ContadorRepository contadorRepository; 

    public DocumentoService(DocumentoRepository documentoRepository, TipoDocumentoRepository tipoDocumentoRepository, ContadorRepository contadorRepository) {
        this.documentoRepository = documentoRepository;
        this.tipoDocumentoRepository = tipoDocumentoRepository;
        this.contadorRepository = contadorRepository;
    }

    public Documento uploadDocumento(MultipartFile file, Long tipoDocumentoId, Usuario recebidoPor) throws IOException {
        // Diretório de upload
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);

        // Cria o diretório de upload se não existir
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
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

        return fileName;
    }

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

    private static String tokenUsuarioAutenticado;

    public String getTokenUsuarioAutenticado() {
        return tokenUsuarioAutenticado;
    }

    // lista documentos enviados pelo usuario logado
    public List<Documento> listarDocumentosEnviados() {
        Usuario usuarioLogado = getUsuarioLogado();
        return documentoRepository.findByEnviadoPor(usuarioLogado);
    }

    // lista documento recebidos pelo usuario logado
    public List<Documento> listarDocumentosRecebidos() {
        Usuario usuarioLogado = getUsuarioLogado();
        return documentoRepository.findByRecebidoPor(usuarioLogado);
    }

    private Usuario getUsuarioLogado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Usuario) {
            return (Usuario) auth.getPrincipal();
        }
        throw new IllegalArgumentException("Usuário não autenticado");
    }

    @Transactional
    public ResponseEntity<Resource> downloadDocumento(Long documentoId) throws IOException {
        Usuario usuarioAutenticado = getUsuarioLogado();
        System.out.println("Usuário autenticado: " + usuarioAutenticado.getIdUsuario());

        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado"));
        System.out.println(
                "Documento encontrado. Destinatário do documento: " + documento.getRecebidoPor().getIdUsuario());

        System.out.println("DOCCC::::" + documento);

        if (!documento.getRecebidoPor().getIdUsuario().equals(usuarioAutenticado.getIdUsuario())) {
            System.out.println("VC NAO PODEE");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        Path filePath = Paths.get(documento.getCaminho());
        Resource resource = new FileSystemResource(filePath.toFile());
        System.out.println("RESOURCEEEEEE:::" + resource);

        if (resource.exists()) {
            System.out.println("EXISTEE");

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } else {
            System.out.println("NAO EXISTE");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        }
    }

    // private boolean isValidFileType(String contentType) {
    //     return contentType.equals("image/jpeg") ||
    //             contentType.equals("image/png") ||
    //             contentType.equals("application/pdf") ||
    //             contentType.equals("text/plain") ||
    //             contentType.equals("application/zip");
    // }

    // private void setTokenUsuarioAutenticado(String token) {
    //     tokenUsuarioAutenticado = token;
    // }
}