package com.elevacon.elevacon.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.model.DTOs.DocumentoDTO;
import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.services.DocumentoService;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocumento(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tipoDocumentoId") Long tipoDocumentoId,
            @RequestParam("recebidoPorId") Long recebidoPorId) {

        try {
            // Obtém o usuário que receberá o documento
            Usuario recebidoPor = usuarioRepository.findById(recebidoPorId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário que receberá o documento não encontrado"));

            // Obtém o usuário autenticado e o token dentro da camada de serviço
            Documento documento = documentoService.uploadDocumento(file, tipoDocumentoId, recebidoPor);

            // Imprime o ID e o token do usuário autenticado no console
            // ID do usuário autenticado
            System.out.println("ID do usuário autenticado: " + documento.getEnviadoPor().getId_usuario());

            // Token do usuário autenticado
            String token = documentoService.getTokenUsuarioAutenticado();
            System.out.println("Token do usuário autenticado: " + token);

            return ResponseEntity.ok("Documento enviado com sucesso! ID do documento: " + documento.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar o documento: " + e.getMessage());
        }
    }

    @GetMapping("/enviados")
    public ResponseEntity<List<DocumentoDTO>> listarDocumentosEnviados() {
        List<Documento> documentos = documentoService.listarDocumentosEnviados();

        // Converte a lista de documentos em uma lista de DTOs
        List<DocumentoDTO> documentosDTO = documentos.stream()
                .map(DocumentoDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(documentosDTO);
    }

    @GetMapping("/recebidos")
    public ResponseEntity<List<DocumentoDTO>> listarDocumentosRecebidos() {
        List<Documento> documentos = documentoService.listarDocumentosRecebidos();

        List<DocumentoDTO> documentosDTO = documentos.stream()
                .map(DocumentoDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(documentosDTO);
    }

    @GetMapping("/download/{documentoId}")
    public ResponseEntity<Resource> downloadDocumento(@PathVariable Long documentoId) {
        try {
            return documentoService.downloadDocumento(documentoId);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(null);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new InputStreamResource(new ByteArrayInputStream(
                            "Você não tem permissão para acessar este documento.".getBytes(StandardCharsets.UTF_8))));

        }
    }

}