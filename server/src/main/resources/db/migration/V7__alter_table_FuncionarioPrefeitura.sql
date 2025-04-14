ALTER TABLE funcionario_prefeitura
ADD COLUMN auth_user_id INT NOT NULL,
ADD CONSTRAINT fk_auth_user
    FOREIGN KEY (auth_user_id)
    REFERENCES auth_user(id)
    ON DELETE CASCADE;