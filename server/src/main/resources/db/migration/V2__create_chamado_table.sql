CREATE TABLE IF NOT EXISTS `chamado` (
    `id` int NOT NULL AUTO_INCREMENT,
    `usuario_id` int NOT NULL,
    `data_abertura` datetime NOT NULL,
    `status` varchar(50) NOT NULL,
    `secretaria` varchar(255) NOT NULL,
    `foto_url` varchar(255),
    `latitude` decimal(10,8),
    `longitude` decimal(11,8),
    `descricao` text,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_chamado_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
    ) ENGINE=InnoDB;