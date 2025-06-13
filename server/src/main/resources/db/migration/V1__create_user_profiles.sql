CREATE TABLE auth_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    fcm_token TEXT,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    auth_status VARCHAR(255) NOT NULL
);

CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auth_user_id BIGINT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    rua VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    uf CHAR(2),
    data_cadastro DATETIME NOT NULL,
    CONSTRAINT fk_auth_user
        FOREIGN KEY (auth_user_id)
            REFERENCES auth_user(id)
            ON DELETE CASCADE
);

-- Tabela funcionario_prefeitura
CREATE TABLE funcionario_prefeitura (
    id INT AUTO_INCREMENT PRIMARY KEY, -- SERIAL no Postgres é INT AUTO_INCREMENT no MySQL
    auth_user_id BIGINT NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    secretaria VARCHAR(255) NOT NULL,
    data_cadastro DATETIME NOT NULL,
    CONSTRAINT fk_auth_user
        FOREIGN KEY (auth_user_id)
            REFERENCES auth_user(id)
            ON DELETE CASCADE
);
