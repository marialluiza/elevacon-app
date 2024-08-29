package com.elevacon.elevacon.services;

import com.elevacon.elevacon.model.TipoDocumento;
import com.elevacon.elevacon.repository.TipoDocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoDocumentoService {

    private final TipoDocumentoRepository tipoDocumentoRepository;

    @Autowired
    public TipoDocumentoService(TipoDocumentoRepository tipoDocumentoRepository) {
        this.tipoDocumentoRepository = tipoDocumentoRepository;
    }

    /**
     * Cria um novo TipoDocumento ou atualiza um existente.
     *
     * @param tipoDocumento Objeto TipoDocumento a ser salvo.
     * @return O TipoDocumento salvo.
     */
    public TipoDocumento saveTipoDocumento(TipoDocumento tipoDocumento) {
        return tipoDocumentoRepository.save(tipoDocumento);
    }

    /**
     * Obtém todos os TipoDocumentos.
     *
     * @return Lista de TipoDocumentos.
     */
    public List<TipoDocumento> getAllTipoDocumentos() {
        return tipoDocumentoRepository.findAll();
    }

    /**
     * Obtém um TipoDocumento pelo seu ID.
     *
     * @param id ID do TipoDocumento a ser buscado.
     * @return Um Optional contendo o TipoDocumento se encontrado.
     */
    public Optional<TipoDocumento> getTipoDocumentoById(Long id) {
        return tipoDocumentoRepository.findById(id);
    }

    /**
     * Exclui um TipoDocumento pelo seu ID.
     *
     * @param id ID do TipoDocumento a ser excluído.
     */
    public void deleteTipoDocumento(Long id) {
        tipoDocumentoRepository.deleteById(id);
    }
}