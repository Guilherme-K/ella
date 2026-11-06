-- Execute este comando no MySQL Workbench antes de rodar as migrations.
-- Depois, no terminal, dentro de backend/:
--   npx prisma migrate deploy
--   npm run prisma:generate

CREATE DATABASE IF NOT EXISTS backend_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
