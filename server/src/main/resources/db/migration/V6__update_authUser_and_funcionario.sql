ALTER TABLE auth_user
ADD COLUMN auth_status TEXT NOT NULL;

ALTER TABLE funcionario_prefeitura
ADD COLUMN auth_user_id INT;

ALTER TABLE funcionario_prefeitura
ADD CONSTRAINT fk_auth_user
FOREIGN KEY (auth_user_id)
REFERENCES auth_user(id)
ON DELETE CASCADE;
