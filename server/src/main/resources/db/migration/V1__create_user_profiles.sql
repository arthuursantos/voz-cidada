CREATE TABLE auth_user (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    fcm_token TEXT,
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    auth_status TEXT NOT NULL
);

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    rua VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    uf CHAR(2),
    data_cadastro TIMESTAMP NOT NULL,
    CONSTRAINT fk_auth_user
        FOREIGN KEY (auth_user_id)
        REFERENCES auth_user(id)
        ON DELETE CASCADE
);

CREATE TABLE funcionario_prefeitura (
    id SERIAL PRIMARY KEY,
    auth_user_id INT NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    secretaria VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL,
    CONSTRAINT fk_auth_user
        FOREIGN KEY (auth_user_id)
            REFERENCES auth_user(id)
            ON DELETE CASCADE
);
