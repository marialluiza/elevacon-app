package com.elevacon.elevacon.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.model.StatusDocumento;
import com.elevacon.elevacon.model.TipoDocumento;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.DocumentoRepository;
import com.elevacon.elevacon.repository.TipoDocumentoRepository;
import com.elevacon.elevacon.repository.UsuarioRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;

@Service
public class DocumentoService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final DocumentoRepository documentoRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;

    public DocumentoService(DocumentoRepository documentoRepository, TipoDocumentoRepository tipoDocumentoRepository) {
        this.documentoRepository = documentoRepository;
        this.tipoDocumentoRepository = tipoDocumentoRepository;
    }

    public Documento uploadDocumento(MultipartFile file, Long tipoDocumentoId, Usuario recebidoPor) throws IOException {

        // Traz o usuário AUTENTICADO e sua ROLE
        Authentication usuarioAutenticado = SecurityContextHolder.getContext().getAuthentication();

        if (usuarioAutenticado == null || !(usuarioAutenticado.getPrincipal() instanceof Usuario)) {
            throw new IllegalArgumentException("Usuário não autenticado ou inválido.");
        }

        // Faz o cast para Usuario, já que o Usuario implementa UserDetails
        Usuario enviadoPor = (Usuario) usuarioAutenticado.getPrincipal();

        // Obtém o token do usuário autenticado
        String token = usuarioAutenticado.getCredentials() != null ? usuarioAutenticado.getCredentials().toString()
                : "Token não disponível";

        // Armazena o token para uso posterior
        setTokenUsuarioAutenticado(token);

        // Valida o tipo do arquivo
        String contentType = file.getContentType();
        if (!isValidFileType(contentType)) {
            throw new IllegalArgumentException("Tipo de arquivo não suportado");
        }

        // Valida o tipo de documento
        TipoDocumento tipoDocumento = tipoDocumentoRepository.findById(tipoDocumentoId)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de documento inválido"));

        // Define o diretório de upload
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);

        // Cria o diretório de upload se não existir
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Gera um nome de arquivo único usando UUID
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path path = uploadPath.resolve(fileName);

        // Salva o arquivo no sistema de arquivos
        Files.copy(file.getInputStream(), path);

        // Cria e salva a entidade Documento
        Documento documento = new Documento();
        documento.setNome(fileName);
        documento.setCaminho(path.toString());
        documento.setTipoDocumento(tipoDocumento);
        documento.setDataEnvio(new Date());
        documento.setEnviadoPor(enviadoPor); // O usuário autenticado
        documento.setRecebidoPor(recebidoPor);
        documento.setStatus(StatusDocumento.ENVIADO);

        return documentoRepository.save(documento);
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
}