CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    rua VARCHAR(255) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    complemento VARCHAR(255),
    cidade VARCHAR(255) NOT NULL,
    uf CHAR(2) NOT NULL,
    pais VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL
);

CREATE TABLE funcionario_prefeitura (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    setor VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL
);
