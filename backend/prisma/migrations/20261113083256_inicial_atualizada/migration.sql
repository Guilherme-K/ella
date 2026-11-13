-- CreateTable
CREATE TABLE `conversas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuaria_id` INTEGER NOT NULL,
    `voluntaria_id` INTEGER NULL,
    `status` ENUM('aberta', 'encerrada') NULL DEFAULT 'aberta',
    `criada_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `usuaria_id`(`usuaria_id`),
    INDEX `voluntaria_id`(`voluntaria_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensagens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conversa_id` INTEGER NOT NULL,
    `remetente_id` INTEGER NOT NULL,
    `mensagem` TEXT NOT NULL,
    `enviada_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `conversa_id`(`conversa_id`),
    INDEX `remetente_id`(`remetente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `senha_hash` VARCHAR(255) NOT NULL,
    `criado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `tipo` ENUM('usuaria', 'voluntaria', 'psicologa', 'admin') NOT NULL DEFAULT 'usuaria',
    `accountType` ENUM('usuaria', 'voluntaria', 'psicologa') NOT NULL DEFAULT 'usuaria',
    `telefone` VARCHAR(20) NULL,
    `cidade` VARCHAR(100) NULL,
    `areas_atuacao` TEXT NULL,
    `crm` VARCHAR(30) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `conversas` ADD CONSTRAINT `conversas_ibfk_1` FOREIGN KEY (`usuaria_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `conversas` ADD CONSTRAINT `conversas_ibfk_2` FOREIGN KEY (`voluntaria_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mensagens` ADD CONSTRAINT `mensagens_ibfk_1` FOREIGN KEY (`conversa_id`) REFERENCES `conversas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mensagens` ADD CONSTRAINT `mensagens_ibfk_2` FOREIGN KEY (`remetente_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
