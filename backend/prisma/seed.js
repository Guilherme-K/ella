// Cria/atualiza o usuário administrador da plataforma.
// Execute com: npm run prisma:seed (dentro de backend/)
// ou: node prisma/seed.js
import bcrypt from 'bcryptjs';

import { prisma } from '../src/lib/prisma.js';
import { DEFAULT_AVATAR } from '../src/constants/user.js';

const ADMIN_EMAIL = 'admin@email.com';
const ADMIN_PASSWORD = 'admin1234';
const ADMIN_NAME = 'Admin ELLA';

async function main() {
  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      password,
      role: 'admin',
    },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password,
      role: 'admin',
      avatar: DEFAULT_AVATAR,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log(
    `Admin pronto: id=${admin.id} email=${admin.email} role=${admin.role}`,
  );
}

main()
  .catch((error) => {
    console.error('Erro ao criar o admin:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
