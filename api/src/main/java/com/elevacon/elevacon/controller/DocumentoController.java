package com.elevacon.elevacon.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.repository.DocumentoRepository;
import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.services.DocumentoService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocumento(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tipoDocumentoId") Long tipoDocumentoId,
            @RequestParam("enviadoPorId") Long enviadoPorId,
            @RequestParam("recebidoPorId") Long recebidoPorId) {

        try {

            // Obtém os usuários que enviaram e receberam o documento
            Usuario enviadoPor = usuarioRepository.findById(enviadoPorId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário que enviou o documento não encontrado"));

            System.out.println("enviadoPor:::" + enviadoPor);
            System.out.println("enviadoPorID:::" + enviadoPorId);

            Usuario recebidoPor = usuarioRepository.findById(recebidoPorId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário que receberá o documento não encontrado"));

            System.out.println("recebidoPor:::" + recebidoPor);
            System.out.println("recebidoPorID:::" + recebidoPorId);

            System.out.println("Nome do arquivo: " + file.getOriginalFilename());
            System.out.println("Tipo do conteúdo: " + file.getContentType());
            System.out.println("Tamanho do arquivo: " + file.getSize() + " bytes");

            // Faz o upload do documento
            Documento documento = documentoService.uploadDocumento(file, tipoDocumentoId, enviadoPor, recebidoPor);
            return ResponseEntity.ok("Documento enviado com sucesso! ID do documento: " + documento.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar o documento: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> downloadDocumento(@PathVariable Long id) {
        Optional<Documento> documentoOpt = documentoRepository.findById(id);

        if (documentoOpt.isPresent()) {
            Documento documento = documentoOpt.get();
            File file = new File(documento.getCaminho());

            if (file.exists()) {
                try {
                    FileInputStream fileInputStream = new FileInputStream(file);
                    byte[] fileContent = fileInputStream.readAllBytes();
                    fileInputStream.close();

                    HttpHeaders headers = new HttpHeaders();
                    headers.add(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + documento.getNome() + "\"");

                    return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(null);
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Documento>> listarDocumentos() {
        List<Documento> documentos = documentoRepository.findAll();
        return ResponseEntity.ok(documentos);
    }
}