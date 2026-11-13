-- AlterTable
ALTER TABLE `supportnetwork` ADD COLUMN `category` VARCHAR(80) NULL,
    ADD COLUMN `details` VARCHAR(600) NULL,
    ADD COLUMN `phone` VARCHAR(40) NULL,
    ADD COLUMN `website` VARCHAR(500) NULL;

-- Preenche os cards iniciais com as novas informações.
-- O `category IS NULL` evita sobrescrever dados já editados pelo painel.
UPDATE `supportnetwork`
SET `category` = 'Orientação e atendimento',
    `details` = 'Gratuito, disponível 24 horas por dia, todos os dias. Também atende pelo WhatsApp (61) 9610-0180.',
    `website` = 'https://www.gov.br/mulheres/pt-br/ligue180',
    `phone` = '180'
WHERE `name` = 'Ligue 180' AND `category` IS NULL;

UPDATE `supportnetwork`
SET `category` = 'Segurança e proteção',
    `details` = 'Quando não houver uma delegacia especializada na cidade, também é possível procurar uma delegacia comum.',
    `website` = 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/susp-mulheres/violencia-domestica-e-familiar',
    `phone` = '190'
WHERE `name` = 'Delegacias da Mulher' AND `category` IS NULL;

UPDATE `supportnetwork`
SET `category` = 'Atendimento integrado',
    `details` = 'Pode oferecer apoio psicossocial, atendimento policial, jurídico, alojamento de passagem e outros serviços, conforme a unidade.',
    `website` = 'https://www.gov.br/mulheres/pt-br/acesso-a-informacao/acoes-e-programas/casa-da-mulher-brasileira',
    `phone` = NULL
WHERE `name` = 'Casa da Mulher Brasileira' AND `category` IS NULL;

UPDATE `supportnetwork`
SET `category` = 'Orientação jurídica',
    `details` = 'Pode orientar sobre direitos, medidas protetivas e procedimentos judiciais.',
    `website` = 'https://www.gov.br/mulheres/pt-br/central-de-conteudos/noticias/2026/agosto-defeso-eleitoral/especial-lei-maria-da-penha-saiba-onde-e-como-buscar-ajuda-em-casos-de-violencia-domestica-e-familiar',
    `phone` = NULL
WHERE `name` = 'Defensoria Pública' AND `category` IS NULL;

UPDATE `supportnetwork`
SET `category` = 'Assistência social',
    `details` = 'Pode oferecer acompanhamento especializado, orientação e encaminhamentos para outros serviços públicos.',
    `website` = 'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/unidades-de-atendimento/centro-de-referencia-especializado-de-assistencia-social-creas',
    `phone` = NULL
WHERE `name` = 'CREAS' AND `category` IS NULL;

UPDATE `supportnetwork`
SET `category` = 'Saúde e acolhimento',
    `details` = 'Unidades básicas de saúde e hospitais podem fazer parte dos caminhos de atendimento, conforme a necessidade.',
    `website` = 'https://www.gov.br/saude/pt-br',
    `phone` = NULL
WHERE `name` = 'Serviços de Saúde' AND `category` IS NULL;
