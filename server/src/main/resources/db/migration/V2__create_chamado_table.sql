CREATE TABLE chamado (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    data_abertura TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    secretaria VARCHAR(255),
    foto_antes_url TEXT,
    foto_depois_url TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    CONSTRAINT fk_chamado_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);