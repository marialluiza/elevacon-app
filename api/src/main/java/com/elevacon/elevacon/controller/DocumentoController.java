package com.elevacon.elevacon.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.model.Usuario;
import com.elevacon.elevacon.model.DTOs.DocumentoDTO;
import com.elevacon.elevacon.repository.DocumentoRepository;
import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.services.DocumentoService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

}