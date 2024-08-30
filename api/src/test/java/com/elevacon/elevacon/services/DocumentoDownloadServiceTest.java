package com.elevacon.elevacon.services;

import com.elevacon.elevacon.model.Cliente;
import com.elevacon.elevacon.model.Contador;
import com.elevacon.elevacon.model.Documento;
import com.elevacon.elevacon.repository.ClienteRepository;
import com.elevacon.elevacon.repository.ContadorRepository;
import com.elevacon.elevacon.repository.DocumentoRepository;
import com.elevacon.elevacon.security.Roles.UsuarioRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class DocumentoDownloadServiceTest {

    @InjectMocks
    private DocumentoService documentoService;

    @Mock
    private DocumentoRepository documentoRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private ContadorRepository contadorRepository;

    @Mock
    private SecurityContext securityContext;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testDownloadDocumentosRecebidoDoContador() throws IOException {
        Long contadorId = 1L;
        Long documentoId = 1L;
        byte[] fileData = "document content".getBytes();

        // Mock authentication
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("1"); // ID do contador

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // Mock repositories
        Contador contador = new Contador();
        contador.setId_contador(contadorId);
        when(contadorRepository.findById(contadorId)).thenReturn(Optional.of(contador));

        Documento documento = new Documento();
        documento.setContador(contador);
        documento.setDados(fileData);
        when(documentoRepository.findById(documentoId)).thenReturn(Optional.of(documento));

        // Test service method
        byte[] result = documentoService.downloadDocumentosRecebidoDoContador(contadorId, documentoId);

        assertArrayEquals(fileData, result);
    }

    @Test
    void testDownloadDocumentosRecebidoDoCliente() throws IOException {
        Long clienteId = 1L;
        Long documentoId = 1L;
        byte[] fileData = "document content".getBytes();

        // Mock authentication
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("1"); // ID do cliente

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // Mock repositories
        Cliente cliente = new Cliente();
        cliente.setId_cliente(clienteId);
        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente));

        Documento documento = new Documento();
        documento.setCliente(cliente);
        documento.setDados(fileData);
        when(documentoRepository.findById(documentoId)).thenReturn(Optional.of(documento));

        // Test service method
        byte[] result = documentoService.downloadDocumentosRecebidoDoCliente(clienteId, documentoId);

        assertArrayEquals(fileData, result);
    }

    @Test
    void testDownloadDocumentosRecebidoDoContadorDocumentoNotFound() {
        Long contadorId = 1L;
        Long documentoId = 1L;

        // Mock authentication
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("1"); // ID do contador

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // Mock repositories
        Contador contador = new Contador();
        contador.setId_contador(contadorId);
        when(contadorRepository.findById(contadorId)).thenReturn(Optional.of(contador));
        when(documentoRepository.findById(documentoId)).thenReturn(Optional.empty());

        // Test service method
        assertThrows(RuntimeException.class, () -> documentoService.downloadDocumentosRecebidoDoContador(contadorId, documentoId));
    }

    @Test
    void testDownloadDocumentosRecebidoDoClienteDocumentoNotFound() {
        Long clienteId = 1L;
        Long documentoId = 1L;

        // Mock authentication
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("1"); // ID do cliente

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // Mock repositories
        Cliente cliente = new Cliente();
        cliente.setId_cliente(clienteId);
        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente));
        when(documentoRepository.findById(documentoId)).thenReturn(Optional.empty());

        // Test service method
        assertThrows(RuntimeException.class, () -> documentoService.downloadDocumentosRecebidoDoCliente(clienteId, documentoId));
    }

    @Test
    void testDownloadDocumentosRecebidoDoContadorUserNotFound() {
        Long contadorId = 1L;
        Long documentoId = 1L;

        // Mock authentication
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("2"); // ID do contador não autorizado

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // Mock repositories
        Contador contador = new Contador();
        contador.setId_contador(contadorId);
        when(contadorRepository.findById(contadorId)).thenReturn(Optional.of(contador));

        Documento documento = new Documento();
        documento.setContador(contador);
        when(documentoRepository.findById(documentoId)).thenReturn(Optional.of(documento));

        // Test service method
        assertThrows(RuntimeException.class, () -> documentoService.downloadDocumentosRecebidoDoContador(contadorId, documentoId));
    }

    @Test
    void testDownloadDocumentosRecebidoDoClienteUserNotFound() {
        Long clienteId = 1L;
        Long documentoId = 1L;

        // Mock authentication
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("2"); // ID do cliente não autorizado

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // Mock repositories
        Cliente cliente = new Cliente();
        cliente.setId_cliente(clienteId);
        when(clienteRepository.findById(clienteId)).thenReturn(Optional.of(cliente));

        Documento documento = new Documento();
        documento.setCliente(cliente);
        when(documentoRepository.findById(documentoId)).thenReturn(Optional.of(documento));

        // Test service method
        assertThrows(RuntimeException.class, () -> documentoService.downloadDocumentosRecebidoDoCliente(clienteId, documentoId));
    }
}
