package com.elevacon.elevacon.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.model.StatusDocumento;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.DocumentoRepository;
import com.elevacon.elevacon.repository.TipoDocumentoRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

@Service
public class DocumentoService {

    // @Autowired
    // private UsuarioRepository usuarioRepository;

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
}