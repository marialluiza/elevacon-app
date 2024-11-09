package com.elevacon.elevacon.model;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.elevacon.elevacon.model.DTOs.reqUsuarioDTO;
import com.elevacon.elevacon.security.Roles.UsuarioRole;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario")
@Entity(name = "usuario")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(nullable = false)
    private String login;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusUsuario status;

    @Column(nullable = false, name = "data_criacao")
    private Date dataCriacao;

    @Column(nullable = false)
    private UsuarioRole role;

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = new Date();
        this.status = StatusUsuario.NOVO; 
    }

    @OneToMany(mappedBy = "enviadoPor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Documento> documentosEnviados;

    @OneToMany(mappedBy = "recebidoPor", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<Documento> documentosRecebidos;

    public Usuario(reqUsuarioDTO dados) {
        this.idUsuario = dados.id_usuario();
        this.login = dados.login();
        this.senha = dados.senha();
        this.status = dados.status();
        this.dataCriacao = dados.dataCriacao();
        this.role = dados.role();
        this.status = StatusUsuario.NOVO;
    }

    public Usuario(String login, String senha, Date dataCriacao, UsuarioRole role) {
        this.login = login;
        this.senha = senha;
        this.dataCriacao = dataCriacao;
        this.role = role;
    }

    // GrantedAuthority - método que retorna as roles do usuário
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UsuarioRole.ADMIN) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USUARIO"),
                    new SimpleGrantedAuthority("ROLE_CONTADOR"),
                    new SimpleGrantedAuthority("ROLE_CLIENTE"));
        } else if (this.role == UsuarioRole.CONTADOR) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_CONTADOR"),
                    new SimpleGrantedAuthority("ROLE_CLIENTE"),
                    new SimpleGrantedAuthority("ROLE_USUARIO"));
        } else if (this.role == UsuarioRole.CLIENTE) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_CLIENTE"),
                    new SimpleGrantedAuthority("ROLE_USUARIO"));
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_USUARIO"));
        }
    }

    @Override
    public String getPassword() {
        return senha;
        // throw new UnsupportedOperationException("Unimplemented method
        // 'getPassword'");
    }

    @Override
    public String getUsername() {
        return login;
        // throw new UnsupportedOperationException("Unimplemented method
        // 'getUsername'");
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
        // throw new UnsupportedOperationException("Unimplemented method
        // 'isAccountNonExpired'");
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
        // throw new UnsupportedOperationException("Unimplemented method
        // 'isAccountNonLocked'");
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
        // throw new UnsupportedOperationException("Unimplemented method
        // 'isCredentialsNonExpired'");
    }

    @Override
    public boolean isEnabled() {
        return true;
        // throw new UnsupportedOperationException("Unimplemented method 'isEnabled'");
    }

    public boolean verificarSenha(String senha) {
        return new BCryptPasswordEncoder().matches(senha, this.senha);
    }

    public enum StatusUsuario {
        NOVO, ATIVO, INATIVO
    }

}
