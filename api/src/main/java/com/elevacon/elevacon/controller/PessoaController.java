// package com.elevacon.elevacon.controller;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// // import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// // import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.elevacon.elevacon.model.Pessoa;
// import com.elevacon.elevacon.services.PessoaService;

// @RestController
// @RequestMapping("/pessoa")
// public class PessoaController {

//     @Autowired
//     private PessoaService pessoaService;

//     @PostMapping("/cadastrar-pessoa")
//     public ResponseEntity<Pessoa> inserirPessoa(@RequestBody Pessoa pessoa) {
//         Pessoa novaPessoa = pessoaService.inserirPessoa(pessoa);
//         return new ResponseEntity<>(novaPessoa, HttpStatus.CREATED);
//     }

//     @GetMapping("/listar-pessoas")
//     public List<Pessoa> listarPessoas(){
//         return pessoaService.listarPessoas();
//     }

// @PutMapping("/atualiza/{id}")
// public ResponseEntity<Pessoa> atualizarPessoa(@PathVariable Long id, @RequestBody Pessoa pessoaAtualizada){
//
// }
// }