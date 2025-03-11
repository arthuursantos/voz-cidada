CREATE TABLE chamado (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    data_abertura TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    secretaria VARCHAR(255) NOT NULL,
    foto_url VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    descricao TEXT,
    CONSTRAINT fk_chamado_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);
