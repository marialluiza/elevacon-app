package com.elevacon.elevacon.controller;

import com.elevacon.elevacon.model.DTOs.DocumentoDTO;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.repository.DocumentoRepository;
import com.elevacon.elevacon.repository.UsuarioRepository;
import com.elevacon.elevacon.services.DocumentoService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/documento") // Consistência no nome do recurso em minúsculas
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @PostMapping("/enviar/cliente/{clienteId}")
    public ResponseEntity<?> enviarDocumentoParaCliente(
            @PathVariable Long clienteId,
            @RequestParam("file") MultipartFile arquivo) { // Mudança para 'arquivo'
        try {
            Documento documento = documentoService.enviarDocumentoParaCliente(clienteId,arquivo);
            return ResponseEntity.status(HttpStatus.CREATED).body(documento);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar o arquivo.");
        }
    }

    @PostMapping("/enviar-para-contador/{contadorId}")
    public ResponseEntity<Documento> enviarDocumentoParaContador(@PathVariable Long contadorId,
                                                                 @RequestParam("file") MultipartFile file) {
        try {
            Documento documento = documentoService.enviarDocumentoParaContador(contadorId, file);
            return new ResponseEntity<>(documento, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }


    // Endpoint para exibir documentos recebidos por um contador
    @GetMapping("/contador/{contadorId}")
    public ResponseEntity<List<Documento>> exibirDocumentosContador(@PathVariable Long contadorId) {
        List<Documento> documentos = documentoService.exibirDocumentosContador(contadorId);
        return ResponseEntity.ok(documentos);
    }

    // Endpoint para exibir documentos específicos de um cliente, filtrados pelo contador
    @GetMapping("/contador/{contadorId}/cliente/{clienteId}")
    public ResponseEntity<List<Documento>> exibirDocumentosContadorID(
            @PathVariable Long contadorId,
            @PathVariable Long clienteId) {
        List<Documento> documentos = documentoService.exibirDocumentosContadorID(contadorId, clienteId);
        return ResponseEntity.ok(documentos);
    }

    // Endpoint para exibir documentos enviados por um cliente
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Documento>> exibirDocumentosCliente(@PathVariable Long clienteId) {
        List<Documento> documentos = documentoService.exibirDocumentosCliente(clienteId);
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/baixar/contadores/{contadorId}/{documentoId}")
    public void downloadDocumentosRecebidoDoContador(
            @PathVariable Long contadorId,
            @PathVariable Long documentoId,
            HttpServletResponse response) throws IOException {
        byte[] arquivo = documentoService.downloadDocumentosRecebidoDoContador(contadorId, documentoId);

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=documento.pdf");
        response.setContentLength(arquivo.length);
        response.getOutputStream().write(arquivo);
        response.getOutputStream().flush();
    }

    @GetMapping("/baixar/clientes/{clienteId}/{documentoId}")
    public void downloadDocumentosRecebidoDoCliente(
            @PathVariable Long clienteId,
            @PathVariable Long documentoId,
            HttpServletResponse response) throws IOException {
        byte[] arquivo = documentoService.downloadDocumentosRecebidoDoCliente(clienteId, documentoId);

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=documento.pdf");
        response.setContentLength(arquivo.length);
        response.getOutputStream().write(arquivo);
        response.getOutputStream().flush();
    }

}



