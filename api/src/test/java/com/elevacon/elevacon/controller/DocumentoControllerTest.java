package com.elevacon.elevacon.controller;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.services.DocumentoService;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.DocumentoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.io.IOException;

public class DocumentoControllerTest {

    private MockMvc mockMvc;

    @InjectMocks
    private DocumentoController documentoController;

    @Mock
    private DocumentoService documentoService;

    @Mock
    private MultipartFile file;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(documentoController).build();
    }

    @Test
    public void testEnviarDocumentoParaCliente() throws Exception {
        Documento documento = new Documento();
        documento.setNome("documento.pdf");
        documento.setTipo("application/pdf");
        documento.setDados("conteúdo do arquivo".getBytes());

        when(documentoService.enviarDocumentoParaCliente(anyLong(), any(MultipartFile.class)))
                .thenReturn(documento);

        mockMvc.perform(multipart("/api/documentos/enviar-para-cliente/1")
                        .file("file", "documento.pdf".getBytes())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("documento.pdf"))
                .andExpect(jsonPath("$.tipo").value("application/pdf"));
    }

    @Test
    public void testEnviarDocumentoParaContador() throws Exception {
        Documento documento = new Documento();
        documento.setNome("documento.pdf");
        documento.setTipo("application/pdf");
        documento.setDados("conteúdo do arquivo".getBytes());

        when(documentoService.enviarDocumentoParaContador(anyLong(), any(MultipartFile.class)))
                .thenReturn(documento);

        mockMvc.perform(multipart("/api/documentos/enviar-para-contador/1")
                        .file("file", "documento.pdf".getBytes())
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("documento.pdf"))
                .andExpect(jsonPath("$.tipo").value("application/pdf"));
    }
}
