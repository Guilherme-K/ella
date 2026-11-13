-- AlterTable
ALTER TABLE `user` ADD COLUMN `accountType` VARCHAR(191) NOT NULL DEFAULT 'usuaria',
    ADD COLUMN `crm` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `EmergencyCall` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL DEFAULT 'ligacao_policial',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
