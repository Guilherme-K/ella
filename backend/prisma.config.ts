// Configuração do Prisma CLI (Prisma 7).
// Este arquivo equivale ao prisma7.config.ts do projeto api-completa.
// As variáveis de ambiente são carregadas pelo dotenv a partir do .env.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
