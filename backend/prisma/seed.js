// Cria/atualiza o usuário administrador da plataforma.
// Execute com: npm run prisma:seed (dentro de backend/)
// ou: node prisma/seed.js
import bcrypt from 'bcryptjs';

import { prisma } from '../src/lib/prisma.js';
import { DEFAULT_AVATAR } from '../src/constants/user.js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'elladmin@email.com')
  .trim()
  .toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin ELLA';

const REDES_PADRAO = [
  {
    name: 'Psicólogos',
    category: 'Saúde mental e acolhimento',
    description:
      'Atendimento voluntário e acolhimento emocional com foco em escuta qualificada e fortalecimento psicológico.',
    details:
      'Profissionais voluntários de psicologia oferecem acolhimento e suporte emocional para mulheres em situação de vulnerabilidade.',
    website: 'https://site.cfp.org.br',
    phone: '188',
    image: '/redes/psicologia.svg',
  },
  {
    name: 'Assistência Social',
    category: 'Assistência social',
    description:
      'Atendimento pelo CRAS e CREAS para proteção social, garantia de direitos e acesso a programas socioassistenciais.',
    details:
      'Os Centros de Referência (CRAS e CREAS) acolhem famílias e pessoas em situação de risco, oferecendo orientação e benefícios.',
    website:
      'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/unidades-de-atendimento',
    phone: null,
    image: '/redes/comunidade.svg',
  },
  {
    name: 'ONGs e Movimentos Sociais',
    category: 'Acolhimento e orientação',
    description:
      'Organizações da sociedade civil dedicadas à defesa dos direitos das mulheres, acolhimento e orientação comunitária.',
    details:
      'Rede solidária de apoio mútuo, capacitação, assessoria jurídica comunitária e encaminhamentos.',
    website: 'https://www.geledes.org.br',
    phone: null,
    image: '/redes/acolhimento.svg',
  },
  {
    name: 'Órgãos Governamentais',
    category: 'Segurança e proteção',
    description:
      'Delegacias da Mulher, Ministério Público, Defensoria Pública e Disque 190 para proteção imediata e cumprimento das leis.',
    details:
      'Canais públicos oficiais para investigação, aplicação de medidas protetivas e garantia dos direitos da mulher.',
    website: 'https://www.gov.br/mulheres/pt-br',
    phone: '190',
    image: '/redes/seguranca.svg',
  },
  {
    name: 'Terapia Ocupacional',
    category: 'Autonomia e bem-estar',
    description:
      'Suporte especializado para promover a autonomia, reinserção nas atividades cotidianas e reconstrução de projetos de vida.',
    details:
      'Acompanhamento para recuperação funcional, resgate da autoestima, rotina segura e fortalecimento da independência.',
    website: 'https://coffito.gov.br',
    phone: null,
    image: '/redes/terapia.svg',
  },
  {
    name: 'Voluntários',
    category: 'Rede colaborativa',
    description:
      'Pessoas e profissionais dispostos a doar tempo, talento e carinho para apoiar quem mais precisa.',
    details:
      'Iniciativas de voluntariado integradas à plataforma ELLA para apoio em acolhimento, orientação e capacitação.',
    website: '/voluntaria',
    phone: null,
    image: '/redes/voluntariado.svg',
  },
  {
    name: 'Ligue 180',
    category: 'Orientação e atendimento',
    description:
      'Central gratuita de atendimento à mulher: orienta sobre direitos, informa serviços e recebe denúncias, 24 horas por dia.',
    details:
      'Gratuito, disponível 24 horas por dia, todos os dias. Também atende pelo WhatsApp (61) 9610-0180.',
    website: 'https://www.gov.br/mulheres/pt-br/ligue180',
    phone: '180',
    image: '/redes/orientacao.svg',
  },
  {
    name: 'Delegacias da Mulher',
    category: 'Segurança e proteção',
    description:
      'Unidades policiais especializadas no atendimento de mulheres em situação de violência, com acolhimento e encaminhamento.',
    details:
      'Quando não houver uma delegacia especializada na cidade, também é possível procurar uma delegacia comum.',
    website:
      'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/susp-mulheres/violencia-domestica-e-familiar',
    phone: '190',
    image: '/redes/seguranca.svg',
  },
  {
    name: 'Casa da Mulher Brasileira',
    category: 'Atendimento integrado',
    description:
      'Espaço público que reúne acolhimento, apoio psicossocial, atendimento policial, jurídico e alojamento de passagem.',
    details:
      'Pode oferecer apoio psicossocial, atendimento policial, jurídico, alojamento de passagem e outros serviços, conforme a unidade.',
    website:
      'https://www.gov.br/mulheres/pt-br/acesso-a-informacao/acoes-e-programas/casa-da-mulher-brasileira',
    phone: null,
    image: '/redes/acolhimento.svg',
  },
  {
    name: 'Defensoria Pública',
    category: 'Orientação jurídica',
    description:
      'Oferece orientação e assistência jurídica gratuita para quem não pode contratar advogado ou advogada.',
    details:
      'Pode orientar sobre direitos, medidas protetivas e procedimentos judiciais.',
    website:
      'https://www.gov.br/mulheres/pt-br/central-de-conteudos/noticias/2026/agosto-defeso-eleitoral/especial-lei-maria-da-penha-saiba-onde-e-como-buscar-ajuda-em-casos-de-violencia-domestica-e-familiar',
    phone: null,
    image: '/redes/justica.svg',
  },
  {
    name: 'CREAS',
    category: 'Assistência social',
    description:
      'Centro de assistência social para pessoas e famílias em situação de risco ou com direitos violados.',
    details:
      'Pode oferecer acompanhamento especializado, orientação e encaminhamentos para outros serviços públicos.',
    website:
      'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/unidades-de-atendimento/centro-de-referencia-especializado-de-assistencia-social-creas',
    phone: null,
    image: '/redes/comunidade.svg',
  },
  {
    name: 'Serviços de Saúde',
    category: 'Saúde e acolhimento',
    description:
      'Unidades de saúde que atendem necessidades da mulher e orientam sobre os serviços disponíveis na rede pública.',
    details:
      'Unidades básicas de saúde e hospitais podem fazer parte dos caminhos de atendimento, conforme a necessidade.',
    website: 'https://www.gov.br/saude/pt-br',
    phone: null,
    image: '/redes/saude.svg',
  },
];

async function main() {
  const existente = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    select: { id: true },
  });

  if (!existente && !ADMIN_PASSWORD) {
    throw new Error(
      'Defina ADMIN_PASSWORD no arquivo .env para criar a conta administrativa.',
    );
  }

  const password = ADMIN_PASSWORD
    ? await bcrypt.hash(ADMIN_PASSWORD, 10)
    : undefined;

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: 'admin',
    },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      ...(password ? { password } : {}),
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

  // Garante que todas as redes padrão (inclusive as vindas de /data) existam no banco.
  let inseridas = 0;
  for (const rede of REDES_PADRAO) {
    const existente = await prisma.supportNetwork.findFirst({
      where: { name: rede.name },
    });

    if (!existente) {
      await prisma.supportNetwork.create({ data: rede });
      inseridas += 1;
    } else {
      await prisma.supportNetwork.update({
        where: { id: existente.id },
        data: {
          category: existente.category || rede.category,
          details: existente.details || rede.details,
          website: existente.website || rede.website,
          phone: existente.phone || rede.phone,
          image: existente.image || rede.image,
        },
      });
    }
  }

  const totalFinal = await prisma.supportNetwork.count();
  console.log(
    `Rede de Apoio sincronizada: ${inseridas} nova(s) rede(s) inserida(s). Total no banco: ${totalFinal}.`,
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
