CREATE TABLE historico_chamado (
    id SERIAL PRIMARY KEY,
    chamado_id INT NOT NULL,
    funcionario_id INT NOT NULL,
    data_modificacao TIMESTAMP NOT NULL,
    status_anterior VARCHAR(50) NOT NULL,
    status_novo VARCHAR(50) NOT NULL,
    observacao TEXT,
    CONSTRAINT fk_historico_chamado FOREIGN KEY (chamado_id) REFERENCES chamado (id),
    CONSTRAINT fk_historico_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionario_prefeitura (id)
    );

CREATE TABLE avaliacao (
    id SERIAL PRIMARY KEY,
    chamado_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estrelas INT NOT NULL,
    comentario TEXT,
    data_avaliacao TIMESTAMP NOT NULL,
    CONSTRAINT fk_avaliacao_chamado FOREIGN KEY (chamado_id) REFERENCES chamado (id),
    CONSTRAINT fk_avaliacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);