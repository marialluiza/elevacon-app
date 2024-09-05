package com.elevacon.elevacon.controller;

import com.elevacon.elevacon.model.TipoDocumento;
import com.elevacon.elevacon.services.TipoDocumentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tipo-documentos")
public class TipoDocumentoController {

    private final TipoDocumentoService tipoDocumentoService;

    public TipoDocumentoController(TipoDocumentoService tipoDocumentoService) {
        this.tipoDocumentoService = tipoDocumentoService;
    }

    /**
     * Cria ou atualiza um TipoDocumento.
     * 
     * @param tipoDocumento Objeto TipoDocumento a ser salvo.
     * @return Resposta com o TipoDocumento salvo e código HTTP 201 (Created).
     */
    @PostMapping
    @RequestMapping("/cadastrar")
    public ResponseEntity<TipoDocumento> createOrUpdateTipoDocumento(@RequestBody TipoDocumento tipoDocumento) {
        TipoDocumento savedTipoDocumento = tipoDocumentoService.saveTipoDocumento(tipoDocumento);
        return new ResponseEntity<>(savedTipoDocumento, HttpStatus.CREATED);
    }

    /**
     * Obtém todos os TipoDocumentos.
     *
     * @return Resposta com a lista de TipoDocumentos e código HTTP 200 (OK).
     */
    @GetMapping
    @RequestMapping("/listar")
    public ResponseEntity<List<TipoDocumento>> getAllTipoDocumentos() {
        List<TipoDocumento> tipoDocumentos = tipoDocumentoService.getAllTipoDocumentos();
        return new ResponseEntity<>(tipoDocumentos, HttpStatus.OK);
    }

    /**
     * Obtém um TipoDocumento pelo seu ID.
     *
     * @param id ID do TipoDocumento a ser buscado.
     * @return Resposta com o TipoDocumento encontrado ou código HTTP 404 (Not
     *         Found) se não encontrado.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TipoDocumento> getTipoDocumentoById(@PathVariable("id") Long id) {
        Optional<TipoDocumento> tipoDocumento = tipoDocumentoService.getTipoDocumentoById(id);
        return tipoDocumento.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Exclui um TipoDocumento pelo seu ID.
     *
     * @param id ID do TipoDocumento a ser excluído.
     * @return Resposta com código HTTP 204 (No Content) se excluído com sucesso, ou
     *         código HTTP 404 (Not Found) se não encontrado.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoDocumento(@PathVariable("id") Long id) {
        if (tipoDocumentoService.getTipoDocumentoById(id).isPresent()) {
            tipoDocumentoService.deleteTipoDocumento(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}