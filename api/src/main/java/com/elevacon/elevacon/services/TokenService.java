package com.elevacon.elevacon.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.elevacon.elevacon.model.Usuario;

@Service
public class TokenService {
    
    // 'Secret' é um dado sensível (como senhas ou chaves API) usado para proteger a segurança da aplicação.
    @Value("${api.security.token.secret}") // caminho definido em 'aplication.properties'
    String secret;

    public String geraToken(Usuario usuario){
        try {
            //recebe por parametro uma secret, que é o que torna os hashs unicos -> a secret não fica armazenada no código e atua como algo único do nosso código
            Algorithm algorithm = Algorithm.HMAC256(secret); 
            String token = JWT.create()
                .withIssuer("auth-api")
                .withSubject(usuario.getLogin()) // 1. adiciona objeto 
                .withExpiresAt(geraExpiracao())
                .sign(algorithm);
            return token;   

        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao tentar gerar token.", exception);
        }
    }

    public String validaToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret); 
            return JWT.require(algorithm)
                .withIssuer("auth-api")
                .build()
                .verify(token) // 2. descriptografa o token
                .getSubject(); // 3. pega o objeto criado no item 1

        } catch (JWTVerificationException exception ) {
            throw new RuntimeException("Token inválido ou expirado.", exception);
            //return "";
        }
    }

    private Instant geraExpiracao(){
        return LocalDateTime.now().plusHours(1).toInstant(ZoneOffset.of("-03:00"));
    }
}
