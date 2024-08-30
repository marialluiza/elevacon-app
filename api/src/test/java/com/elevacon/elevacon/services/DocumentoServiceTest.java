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
public class DocumentoServiceTest {

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
    public void setup() {
        MockitoAnnotations.openMocks(this);
        // Configura a autenticação simulada
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("1"); // Supondo que o ID do contador é 1
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    public void testEnviarDocumentoParaCliente() throws IOException {
        Long clienteId = 1L;
        Long contadorId = 1L;

        Contador contador = new Contador();
        contador.setId_contador(contadorId);

        Cliente cliente = new Cliente();
        cliente.setId_cliente(clienteId);
        cliente.setContador(contador);

        Documento documento = new Documento();
        documento.setNome("documento.pdf");
        documento.setTipo("application/pdf");
        documento.setDados("conteúdo do arquivo".getBytes());
        documento.setCliente(cliente);
        documento.setContador(contador);

        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente));
        when(contadorRepository.findById(contadorId)).thenReturn(Optional.of(contador));
        when(file.getOriginalFilename()).thenReturn("documento.pdf");
        when(file.getContentType()).thenReturn("application/pdf");
        when(file.getBytes()).thenReturn("conteúdo do arquivo".getBytes());
        when(documentoRepository.save(any(Documento.class))).thenReturn(documento);

        Documento resultado = documentoService.enviarDocumentoParaCliente(clienteId, file);

        assertNotNull(resultado);
        assertEquals("documento.pdf", resultado.getNome());
        assertEquals("application/pdf", resultado.getTipo());
        assertArrayEquals("conteúdo do arquivo".getBytes(), resultado.getDados());
        verify(documentoRepository).save(any(Documento.class));
    }

    @Test
    public void testEnviarDocumentoParaContador() throws IOException {
        Long contadorId = 1L;
        Long clienteId = 1L;

        Contador contador = new Contador();
        contador.setId_contador(contadorId);

        Cliente cliente = new Cliente();
        cliente.setId_cliente(clienteId);
        cliente.setContador(contador);

        Documento documento = new Documento();
        documento.setNome("documento.pdf");
        documento.setTipo("application/pdf");
        documento.setDados("conteúdo do arquivo".getBytes());
        documento.setCliente(cliente);
        documento.setContador(contador);

        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente));
        when(contadorRepository.findById(contadorId)).thenReturn(Optional.of(contador));
        when(file.getOriginalFilename()).thenReturn("documento.pdf");
        when(file.getContentType()).thenReturn("application/pdf");
        when(file.getBytes()).thenReturn("conteúdo do arquivo".getBytes());
        when(documentoRepository.save(any(Documento.class))).thenReturn(documento);

        Documento resultado = documentoService.enviarDocumentoParaContador(contadorId, file);

        assertNotNull(resultado);
        assertEquals("documento.pdf", resultado.getNome());
        assertEquals("application/pdf", resultado.getTipo());
        assertArrayEquals("conteúdo do arquivo".getBytes(), resultado.getDados());
        verify(documentoRepository).save(any(Documento.class));
    }
}
