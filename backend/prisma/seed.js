// Cria/atualiza o usuário administrador da plataforma.
// Execute com: npm run prisma:seed (dentro de backend/)
// ou: node prisma/seed.js
import bcrypt from 'bcryptjs';

import { prisma } from '../src/lib/prisma.js';
import { DEFAULT_AVATAR } from '../src/constants/user.js';

const ADMIN_EMAIL = 'elladmin@email.com';
const ADMIN_PASSWORD = '12345678';
const ADMIN_NAME = 'Admin ELLA';

const REDES_PADRAO = [
  {
    name: 'Ligue 180',
    description:
      'Central gratuita de atendimento à mulher: orienta sobre direitos, informa serviços e recebe denúncias, 24 horas por dia.',
    image: '/redes/orientacao.svg',
  },
  {
    name: 'Delegacias da Mulher',
    description:
      'Unidades policiais especializadas no atendimento de mulheres em situação de violência, com acolhimento e encaminhamento.',
    image: '/redes/seguranca.svg',
  },
  {
    name: 'Casa da Mulher Brasileira',
    description:
      'Espaço público que reúne acolhimento, apoio psicossocial, atendimento policial, jurídico e alojamento de passagem.',
    image: '/redes/acolhimento.svg',
  },
  {
    name: 'Defensoria Pública',
    description:
      'Oferece orientação e assistência jurídica gratuita para quem não pode contratar advogado ou advogada.',
    image: '/redes/justica.svg',
  },
  {
    name: 'CREAS',
    description:
      'Centro de assistência social para pessoas e famílias em situação de risco ou com direitos violados.',
    image: '/redes/comunidade.svg',
  },
  {
    name: 'Serviços de Saúde',
    description:
      'Unidades de saúde que atendem necessidades da mulher e orientam sobre os serviços disponíveis na rede pública.',
    image: '/redes/saude.svg',
  },
];

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

  // Popula a Rede de Apoio apenas quando ainda não há cards cadastrados.
  const totalRedes = await prisma.supportNetwork.count();

  if (totalRedes === 0) {
    await prisma.supportNetwork.createMany({ data: REDES_PADRAO });
    console.log(`Rede de Apoio inicial criada com ${REDES_PADRAO.length} cards.`);
  } else {
    console.log(`Rede de Apoio já possui ${totalRedes} card(s).`);
  }
}

main()
  .catch((error) => {
    console.error('Erro ao criar o admin:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
