package com.elevacon.elevacon.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

//desabilitando configurações padrões do Spring Security
//habilitando as prórias configurações

@Configuration // indica ao spring que é uma classe de configurações
@EnableWebSecurity // indica ao spring security que aqui serão definidas as configurações
                   // relacionadas a 'WebSecurity'
public class ConfigSeguranca {

    @Autowired
    FiltroSeguranca filtroSeguranca;

    // corrente de filtros que vou aplicar a minha requisição para manter a
    // segurança da aplicação
    // os filtros são métodos de validação para saber se o usuário tem permissão
    // para fazer determinada requisição

    // nome de método já pré-definido para o springSecurtiy
    @Bean // pra que o spring consiga instanciar a classe
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // indica
                                                                                                              // que
                                                                                                              // será
                                                                                                              // autenticação
                                                                                                              // STATELESS(autenticação
                                                                                                              // por
                                                                                                              // token)
                .authorizeHttpRequests(autoriza -> autoriza // define requisições http que serão autorizadas e a aprtir
                                                            // de quais roles

                        .requestMatchers(HttpMethod.POST, "/autentica/login").permitAll()
                        // .requestMatchers(HttpMethod.POST, "/pessoa/cadastrar-pessoa").permitAll()

                        .requestMatchers(HttpMethod.POST, "/documentos/upload").hasRole("USUARIO")
                        .requestMatchers(HttpMethod.POST, "/documentos/enviados").hasRole("USUARIO")
                        .requestMatchers(HttpMethod.POST, "/documentos/recebidos").hasRole("USUARIO")

                        .requestMatchers(HttpMethod.POST, "/autentica/cadastrar").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/usuario/listar-usuarios").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/usuario").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/pessoa/listar-pessoas").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/contador/cadastrar-contador").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/contador/listar-contadores").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/usuario/remover").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/usuario/remover").hasRole("CONTADOR")
                        .requestMatchers(HttpMethod.GET, "/cliente/listar-clientes").hasRole("CONTADOR")
                        .requestMatchers(HttpMethod.POST, "/cliente/cadastrar-cliente").hasRole("CONTADOR")

                        .requestMatchers(HttpMethod.PUT, "/cliente/editar-cliente").hasRole("CONTADOR")
                        .requestMatchers(HttpMethod.GET, "/cliente/buscar-cliente").hasRole("CONTADOR")
                        .requestMatchers(HttpMethod.DELETE, "/cliente/excluir-cliente").hasRole("CONTADOR")

                        .requestMatchers(HttpMethod.POST, "/tipo-documentos/cadastrar").hasRole("CONTADOR")

                        .anyRequest().authenticated())
                .addFilterBefore(filtroSeguranca, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // classe do spring para criptografia
    }
}
