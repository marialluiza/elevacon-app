package com.elevacon.elevacon.controller;

import com.elevacon.elevacon.model.DTOs.DocumentoDTO;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.services.DocumentoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DocumentoControllerTest {

    @Mock
    private DocumentoService documentoService;

    @InjectMocks
    private DocumentoController documentoController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(documentoController).build();
    }

    @Test
    void testEnviarDocumentoParaCliente() throws Exception {
        Long clienteId = 1L;
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "test content".getBytes());

        Documento documentoMock = new Documento();
        when(documentoService.enviarDocumentoParaCliente(clienteId, file)).thenReturn(documentoMock);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/documento/enviar/cliente/{clienteId}", clienteId)
                        .file(file)) // Use multipart instead of post
                .andExpect(status().isCreated());

        verify(documentoService, times(1)).enviarDocumentoParaCliente(clienteId, file);
    }
    @Test
    void testEnviarDocumentoParaContador() throws Exception {
        Long contadorId = 1L;
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "test content".getBytes());

        Documento documentoMock = new Documento();
        when(documentoService.enviarDocumentoParaContador(contadorId, file)).thenReturn(documentoMock);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/documento/enviar-para-contador/{contadorId}", contadorId)
                        .file(file)) // Use multipart instead of post
                .andExpect(status().isCreated());

        verify(documentoService, times(1)).enviarDocumentoParaContador(contadorId, file);
    }

    @Test
    void testExibirDocumentosContador() throws Exception {
        Long contadorId = 1L;
        List<Documento> documentosMock = Arrays.asList(new Documento(), new Documento());

        when(documentoService.exibirDocumentosContador(contadorId)).thenReturn(documentosMock);

        mockMvc.perform(get("/documento/contador/{contadorId}", contadorId))
                .andExpect(status().isOk());

        verify(documentoService, times(1)).exibirDocumentosContador(contadorId);
    }

    @Test
    void testExibirDocumentosContadorID() throws Exception {
        Long contadorId = 1L;
        Long clienteId = 1L;
        List<Documento> documentosMock = Arrays.asList(new Documento(), new Documento());

        when(documentoService.exibirDocumentosContadorID(contadorId, clienteId)).thenReturn(documentosMock);

        mockMvc.perform(get("/documento/contador/{contadorId}/cliente/{clienteId}", contadorId, clienteId))
                .andExpect(status().isOk());

        verify(documentoService, times(1)).exibirDocumentosContadorID(contadorId, clienteId);
    }

    @Test
    void testExibirDocumentosCliente() throws Exception {
        Long clienteId = 1L;
        List<Documento> documentosMock = Arrays.asList(new Documento(), new Documento());

        when(documentoService.exibirDocumentosCliente(clienteId)).thenReturn(documentosMock);

        mockMvc.perform(get("/documento/cliente/{clienteId}", clienteId))
                .andExpect(status().isOk());

        verify(documentoService, times(1)).exibirDocumentosCliente(clienteId);
    }

    @Test
    void testDownloadDocumentosRecebidoDoContador() throws Exception {
        Long contadorId = 1L;
        Long documentoId = 1L;
        byte[] arquivoMock = "arquivo".getBytes();

        when(documentoService.downloadDocumentosRecebidoDoContador(contadorId, documentoId)).thenReturn(arquivoMock);

        mockMvc.perform(get("/documento/baixar/contadores/{contadorId}/{documentoId}", contadorId, documentoId))
                .andExpect(status().isOk());

        verify(documentoService, times(1)).downloadDocumentosRecebidoDoContador(contadorId, documentoId);
    }

    @Test
    void testDownloadDocumentosRecebidoDoCliente() throws Exception {
        Long clienteId = 1L;
        Long documentoId = 1L;
        byte[] arquivoMock = "arquivo".getBytes();

        when(documentoService.downloadDocumentosRecebidoDoCliente(clienteId, documentoId)).thenReturn(arquivoMock);

        mockMvc.perform(get("/documento/baixar/clientes/{clienteId}/{documentoId}", clienteId, documentoId))
                .andExpect(status().isOk());

        verify(documentoService, times(1)).downloadDocumentosRecebidoDoCliente(clienteId, documentoId);
    }
}
