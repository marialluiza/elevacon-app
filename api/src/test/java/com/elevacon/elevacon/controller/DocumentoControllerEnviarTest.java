package com.elevacon.elevacon.controller;

import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.services.DocumentoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class DocumentoControllerEnviarTest {

    @Mock
    private DocumentoService documentoService;

    @InjectMocks
    private DocumentoController documentoController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void enviarDocumentoParaCliente() throws Exception {
        Long clienteId = 1L;
        MockMultipartFile mockFile = new MockMultipartFile("file", "documento.pdf", "application/pdf", "conteúdo do documento".getBytes());

        Documento mockDocumento = new Documento(); // Simule o objeto Documento
        when(documentoService.enviarDocumentoParaCliente(clienteId, mockFile)).thenReturn(mockDocumento);

        ResponseEntity<?> response = documentoController.enviarDocumentoParaCliente(clienteId, mockFile);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(mockDocumento, response.getBody());
        verify(documentoService, times(1)).enviarDocumentoParaCliente(clienteId, mockFile);
    }

    @Test
    void enviarDocumentoParaClienteErro() throws Exception {
        Long clienteId = 1L;
        MockMultipartFile mockFile = new MockMultipartFile("file", "documento.pdf", "application/pdf", "conteúdo do documento".getBytes());

        when(documentoService.enviarDocumentoParaCliente(clienteId, mockFile)).thenThrow(new RuntimeException("Erro ao processar o arquivo."));

        ResponseEntity<?> response = documentoController.enviarDocumentoParaCliente(clienteId, mockFile);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Erro ao processar o arquivo.", response.getBody());
        verify(documentoService, times(1)).enviarDocumentoParaCliente(clienteId, mockFile);
    }
}
