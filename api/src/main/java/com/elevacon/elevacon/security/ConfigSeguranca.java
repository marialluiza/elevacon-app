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
@EnableWebSecurity // indica ao spring security que aqui serão definidas as configurações relacionadas a 'WebSecurity'
public class ConfigSeguranca {

    @Autowired
    FiltroSeguranca filtroSeguranca;

    // corrente de filtros que vou aplicar a minha requisição para manter a
    // segurança da aplicação
    // os filtros são métodos de validação para saber se o usuário tem permissão
    // para fazer determinada requisição

    // nome de método já pré-definido para o springSecurtiy
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(autoriza -> autoriza
                        // Liberando todas as rotas
                        .requestMatchers(HttpMethod.GET, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/**").permitAll()

                        // Outras permissões específicas, se necessário
                        // .requestMatchers(HttpMethod.GET, "/alguma-rota").permitAll()
                        // .requestMatchers(HttpMethod.POST, "/outra-rota").permitAll()

                        .anyRequest().permitAll() // Garantir que todas as outras requisições também sejam permitidas
                )
                .addFilterBefore(filtroSeguranca, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder (){
        return new BCryptPasswordEncoder(); //classe do spring para criptografia
    }
}