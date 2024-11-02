
// package com.elevacon.elevacon.model.DTOs.Mappers;

// import com.elevacon.elevacon.model.Cliente;
// import com.elevacon.elevacon.model.DTOs.ClienteDTO;

// public class ClienteMapper {

//     public ClienteDTO toDto(Cliente cliente) {
//         if (cliente == null) {
//             return null;
//         }

//         ClienteDTO dto = new ClienteDTO();
//         dto.setId_cliente(cliente.getId_cliente());
//         dto.setNome(cliente.getNome());
//         dto.setEmail(cliente.getEmail());
//         dto.setTelefone(cliente.getTelefone());
//         dto.setTitulo_eleitoral(cliente.getTitulo_eleitoral());
//         dto.setConjugue(cliente.isConjugue());
//         dto.setCpf(cliente.getCpf());
//         dto.setData_nascimento(cliente.getData_nascimento());
//         dto.setDependente(cliente.isDependente());
//         dto.setOcupacao_principal(cliente.getOcupacao_principal());
//         dto.setLogradouro(cliente.getLogradouro());
//         dto.setNumero(cliente.getNumero());
//         dto.setBairro(cliente.getBairro());
//         dto.setCidade(cliente.getCidade());
//         dto.setEstado(cliente.getEstado());
//         dto.setCep(cliente.getCep());
//         dto.setObservacao(cliente.getObservacao());
//         dto.setNome_conjugue(cliente.getNome_conjugue());
//         dto.setCpf_conjugue(cliente.getCpf_conjugue());

//         return dto;
//     }

//     // Método para converter ClienteDTO em Cliente
//     public Cliente toEntity(ClienteDTO dto) {
//         if (dto == null) {
//             return null;
//         }

//         Cliente cliente = new Cliente();
//         cliente.setId_cliente(dto.getId_cliente());
//         cliente.setNome(dto.getNome());
//         cliente.setEmail(dto.getEmail());
//         cliente.setTelefone(dto.getTelefone());
//         cliente.setTitulo_eleitoral(dto.getTitulo_eleitoral());
//         cliente.setConjugue(dto.isConjugue());
//         cliente.setCpf(dto.getCpf());
//         cliente.setData_nascimento(dto.getData_nascimento());
//         cliente.setDependente(dto.isDependente());
//         cliente.setOcupacao_principal(dto.getOcupacao_principal());
//         cliente.setLogradouro(dto.getLogradouro());
//         cliente.setNumero(dto.getNumero());
//         cliente.setBairro(dto.getBairro());
//         cliente.setCidade(dto.getCidade());
//         cliente.setEstado(dto.getEstado());
//         cliente.setCep(dto.getCep());
//         cliente.setObservacao(dto.getObservacao());
//         cliente.setNome_conjugue(dto.getNome_conjugue());
//         cliente.setCpf_conjugue(dto.getCpf_conjugue());

//         return cliente;
//     }
// }
