CREATE TABLE IF NOT EXISTS `usuario` (
    `id` int NOT NULL AUTO_INCREMENT,
    `data_nascimento` date NOT NULL,
    `cpf` varchar(11) NOT NULL,
    `cep` varchar(8) NOT NULL,
    `rua` varchar(255) NOT NULL,
    `numero` varchar(10) NOT NULL,
    `bairro` varchar(255) NOT NULL,
    `complemento` varchar(255),
    `cidade` varchar(255) NOT NULL,
    `uf` char(2) NOT NULL,
    `pais` varchar(255) NOT NULL,
    `data_cadastro` datetime NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `funcionario_prefeitura` (
    `id` int NOT NULL AUTO_INCREMENT,
    `cpf` varchar(11) NOT NULL,
    `cargo` varchar(255) NOT NULL,
    `setor` varchar(255) NOT NULL,
    `data_cadastro` datetime NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB;