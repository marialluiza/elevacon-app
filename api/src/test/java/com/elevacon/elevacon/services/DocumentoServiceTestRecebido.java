package com.elevacon.elevacon.services;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.DocumentoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DocumentoServiceTestRecebido {

    @InjectMocks
    private DocumentoService documentoService;

    @Mock
    private DocumentoRepository documentoRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private ContadorRepository contadorRepository;

    @Mock
    private MultipartFile file;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        // Configurações padrão, sem stubs desnecessários
    }
    @Test
    public void testExibirDocumentosContador() {
        Long contadorId = 1L;

        Contador contador = new Contador();
        contador.setId_contador(contadorId);

        Cliente cliente = new Cliente();
        cliente.setId_cliente(1L); // Ajustado para 1

        Documento documento1 = new Documento();
        documento1.setId_documento(1L);
        documento1.setNome("documento1.pdf");
        documento1.setContador(contador);
        documento1.setCliente(cliente);

        Documento documento2 = new Documento();
        documento2.setId_documento(2L);
        documento2.setNome("documento2.pdf");
        documento2.setContador(contador);
        documento2.setCliente(cliente);

        List<Documento> documentos = Arrays.asList(documento1, documento2);

        when(contadorRepository.findById(contadorId)).thenReturn(Optional.of(contador)); // Certifique-se de que o contador é retornado
        when(documentoRepository.findByContador(contador)).thenReturn(documentos);

        List<Documento> resultado = documentoService.exibirDocumentosContador(contadorId);

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("documento1.pdf", resultado.get(0).getNome());
        assertEquals(1L, resultado.get(0).getCliente().getId_cliente());
        assertEquals("documento2.pdf", resultado.get(1).getNome());
        assertEquals(1L, resultado.get(1).getCliente().getId_cliente());
    }

    @Test
    public void testExibirDocumentosCliente() {
        Long clienteId = 1L;

        Cliente cliente = new Cliente();
        cliente.setId_cliente(clienteId);

        Contador contador = new Contador();
        contador.setId_contador(1L); // Ajustado para 1

        Documento documento1 = new Documento();
        documento1.setId_documento(1L);
        documento1.setNome("documento1.pdf");
        documento1.setCliente(cliente);
        documento1.setContador(contador);

        Documento documento2 = new Documento();
        documento2.setId_documento(2L);
        documento2.setNome("documento2.pdf");
        documento2.setCliente(cliente);
        documento2.setContador(contador);

        List<Documento> documentos = Arrays.asList(documento1, documento2);

        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente)); // Certifique-se de que o cliente é retornado
        when(documentoRepository.findByCliente(cliente)).thenReturn(documentos);

        List<Documento> resultado = documentoService.exibirDocumentosCliente(clienteId);

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("documento1.pdf", resultado.get(0).getNome());
        assertEquals("documento2.pdf", resultado.get(1).getNome());
    }
}
