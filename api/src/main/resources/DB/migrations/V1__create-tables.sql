-- CREATE TABLE usuario (
--     id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
--     login VARCHAR(255) NOT NULL,
--     senha VARCHAR(255) NOT NULL,
--     usuariotivo BOOLEAN DEFAULT FALSE,
--     data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE pessoa (
--     id_pessoa BIGINT AUTO_INCREMENT PRIMARY KEY,
--     nome VARCHAR(255) NOT NULL,
--     email VARCHAR(255),
--     numeroTelefone VARCHAR(20)
-- );

-- CREATE TABLE contador (
--     id_contador BIGINT AUTO_INCREMENT PRIMARY KEY,
--     crc VARCHAR(255),
--     id_usuario BIGINT,
--     FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
-- );

-- CREATE TABLE cliente (
--     id_cliente BIGINT AUTO_INCREMENT PRIMARY KEY,
--     titulo_eleitoral VARCHAR(255),
--     conjugue BOOLEAN,
--     cpf VARCHAR(255),
--     data_nascimento DATE,
--     dependente BOOLEAN,
--     ocupacao_principal VARCHAR(255),
--     nome_conjugue VARCHAR(255),
--     cpf_conjugue VARCHAR(255),
--     id_contador BIGINT,
--     FOREIGN KEY (id_contador) REFERENCES contador(id_contador)
-- );
