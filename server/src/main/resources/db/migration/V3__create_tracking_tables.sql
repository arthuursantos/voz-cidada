CREATE TABLE IF NOT EXISTS `historico_chamado` (
    `id` int NOT NULL AUTO_INCREMENT,
    `chamado_id` int NOT NULL,
    `funcionario_id` int NOT NULL,
    `data_modificacao` datetime NOT NULL,
    `status_anterior` varchar(50) NOT NULL,
    `status_novo` varchar(50) NOT NULL,
    `observacao` text,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_historico_chamado` FOREIGN KEY (`chamado_id`) REFERENCES `chamado` (`id`),
    CONSTRAINT `fk_historico_funcionario` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionario_prefeitura` (`id`)
    ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `avaliacao` (
    `id` int NOT NULL AUTO_INCREMENT,
    `chamado_id` int NOT NULL,
    `usuario_id` int NOT NULL,
    `estrelas` int NOT NULL,
    `comentario` text,
    `data_avaliacao` datetime NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_avaliacao_chamado` FOREIGN KEY (`chamado_id`) REFERENCES `chamado` (`id`),
    CONSTRAINT `fk_avaliacao_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
    ) ENGINE=InnoDB;