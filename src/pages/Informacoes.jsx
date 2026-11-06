import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHand,
  faBrain,
  faVenusMars,
  faWallet,
  faCommentDots,
  faUsers,
  faMobileScreenButton,
  faLandmark,
  faBuilding,
  faBriefcase,
  faHospital,
  faPhone,
  faArrowRight,
  faShieldHalved,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

const formasLegais = [
  {
    id: 'violencia-fisica',
    titulo: 'Violência física',
    icone: faHand,
    resumo:
      'É qualquer ação que prejudique a integridade ou a saúde corporal da mulher. Não é necessário que a agressão deixe marcas visíveis para ser reconhecida como violência.',
    exemplos: [
      'Empurrar, dar tapas, apertar ou sacudir.',
      'Arremessar objetos contra a mulher ou impedir fisicamente seus movimentos.',
      'Praticar qualquer agressão que cause dor, lesão ou risco à saúde.'
    ],
    protecao: [
      'Se houver perigo imediato, procure um local seguro, quando possível, e acione a Polícia Militar pelo 190.',
      'Busque atendimento de saúde caso tenha sofrido uma agressão ou esteja preocupada com sua integridade física.',
      'Procure uma pessoa de confiança e entre em contato com o Ligue 180 para conhecer os serviços de acolhimento e proteção disponíveis.'
    ]
  },
  {
    id: 'violencia-psicologica',
    titulo: 'Violência psicológica',
    icone: faBrain,
    resumo:
      'Acontece quando alguém provoca dano emocional, diminui a autoestima ou tenta controlar as decisões, os comportamentos e a liberdade da mulher.',
    exemplos: [
      'Humilhar, insultar, ridicularizar ou fazer ameaças constantes.',
      'Impedir o contato com amigos e familiares ou tentar controlar a rotina.',
      'Vigiar, perseguir, manipular ou fazer a mulher duvidar da própria percepção dos acontecimentos.',
      'Controlar suas escolhas, seus estudos, seu trabalho ou sua liberdade de ir e vir.'
    ],
    protecao: [
      'Converse com alguém de confiança e evite enfrentar a situação sozinha.',
      'Se for seguro, guarde mensagens e registros que ajudem a documentar o que está acontecendo.',
      'Procure orientação pelo Ligue 180 ou em um serviço especializado de atendimento às mulheres.',
      'Um serviço de saúde ou de assistência psicossocial também pode oferecer acolhimento.'
    ]
  },
  {
    id: 'violencia-sexual',
    titulo: 'Violência sexual',
    icone: faVenusMars,
    resumo:
      'É qualquer conduta que obrigue ou constranja a mulher a participar de uma atividade sexual não desejada, ou que limite sua liberdade e seus direitos sexuais e reprodutivos.',
    exemplos: [
      'Praticar ou impor atos sexuais sem consentimento.',
      'Usar ameaças, chantagens, intimidação ou pressão para obter uma relação sexual.',
      'Impedir o uso de métodos contraceptivos.',
      'Obrigar ou pressionar a mulher a engravidar, interromper uma gravidez ou se casar.',
      'Explorar sexualmente ou assediar uma mulher.'
    ],
    protecao: [
      'Seu consentimento importa em qualquer relacionamento. Estar namorando ou casada não significa consentir com toda atividade sexual.',
      'Procure um serviço de saúde para receber atendimento e orientação. Você pode buscar acolhimento mesmo sem saber quais serão os próximos passos.',
      'Converse com uma pessoa de confiança ou procure um serviço especializado.',
      'Em situação de perigo imediato, ligue 190. Para orientação e encaminhamento, procure o Ligue 180.'
    ]
  },
  {
    id: 'violencia-patrimonial',
    titulo: 'Violência patrimonial',
    icone: faWallet,
    resumo:
      'Acontece quando alguém retém, destrói, esconde ou controla os bens, documentos, valores e recursos econômicos da mulher, prejudicando sua autonomia.',
    exemplos: [
      'Controlar todo o dinheiro da mulher ou impedir que ela tenha acesso aos próprios recursos.',
      'Reter ou destruir documentos pessoais e instrumentos de trabalho.',
      'Danificar, esconder ou se apropriar de objetos e bens sem autorização.',
      'Fazer uso indevido de recursos financeiros ou dificultar a independência econômica.'
    ],
    protecao: [
      'Se for seguro, mantenha cópias de documentos importantes e registros de movimentações ou prejuízos.',
      'Busque orientação sobre seus direitos e sobre como proteger documentos e recursos financeiros.',
      'Procure a Defensoria Pública, um serviço especializado ou o Ligue 180 para receber encaminhamento.',
      'Não tome medidas que possam aumentar seu risco sem antes conversar com um serviço de apoio.'
    ]
  },
  {
    id: 'violencia-moral',
    titulo: 'Violência moral',
    icone: faCommentDots,
    resumo:
      'É uma conduta que atinge a honra, a reputação ou a dignidade da mulher. A Lei Maria da Penha relaciona essa forma de violência à calúnia, à difamação e à injúria.',
    exemplos: [
      'Atribuir falsamente à mulher a prática de um crime.',
      'Espalhar informações ou boatos com a intenção de prejudicar sua reputação.',
      'Ofender, xingar ou humilhar a mulher, atingindo sua dignidade.',
      'Expor sua intimidade ou divulgar informações para constrangê-la.'
    ],
    protecao: [
      'Se for seguro, guarde mensagens, publicações, links, datas e outras evidências.',
      'Evite responder a ameaças ou provocações de forma que possa aumentar o risco.',
      'Procure orientação jurídica ou um serviço especializado para entender quais medidas podem ser tomadas.',
      'O Ligue 180 pode orientar e encaminhar denúncias aos órgãos competentes.'
    ]
  },
  {
    id: 'violencia-vicaria',
    titulo: 'Violência vicária',
    icone: faUsers,
    resumo:
      'É a violência praticada contra filhos, familiares, dependentes ou pessoas da rede de apoio da mulher com a finalidade de atingi-la, provocar sofrimento ou exercer controle sobre ela.',
    exemplos: [
      'Ameaçar ou agredir filhos e familiares para intimidar a mulher.',
      'Utilizar pessoas próximas para transmitir ameaças ou pressioná-la.',
      'Manipular vínculos familiares para provocar sofrimento ou afastá-la de sua rede de apoio.',
      'Ameaçar pessoas sob sua responsabilidade para controlar suas decisões.'
    ],
    protecao: [
      'Leve ameaças contra filhos, familiares ou pessoas próximas a sério e procure orientação especializada.',
      'Se alguém estiver em perigo imediato, acione a Polícia Militar pelo 190.',
      'Procure uma pessoa de confiança e o Ligue 180 para conhecer os serviços de proteção disponíveis.',
      'Quando crianças ou adolescentes estiverem em situação de risco, procure também a rede de proteção da infância e adolescência.'
    ]
  }
]

const outrasManifestacoes = [
  {
    id: 'violencia-digital',
    titulo: 'Violência digital',
    etiqueta: 'Pode atravessar várias formas de violência',
    icone: faMobileScreenButton,
    resumo:
      'É a violência praticada ou ampliada por meio de tecnologias, como redes sociais, aplicativos, e-mails e outras plataformas digitais. Pode causar danos psicológicos, morais, sexuais, patrimoniais e até físicos.',
    exemplos: [
      'Divulgar imagens ou conteúdos íntimos sem autorização.',
      'Perseguir, vigiar ou monitorar a mulher pela internet.',
      'Ameaçar, chantagear, humilhar ou assediar por mensagens.',
      'Criar perfis falsos ou utilizar dados pessoais sem autorização.',
      'Divulgar endereço, telefone ou outras informações privadas para expor a mulher.',
      'Criar ou divulgar imagens falsas e montagens para constranger ou ameaçar.'
    ],
    protecao: [
      'Se for seguro, guarde capturas de tela, links, nomes de perfis, datas e mensagens.',
      'Denuncie o conteúdo à plataforma em que foi publicado.',
      'Utilize um dispositivo confiável para buscar ajuda caso suspeite que suas contas ou aparelhos estejam sendo monitorados.',
      'Revise senhas e configurações de privacidade quando isso puder ser feito com segurança.',
      'Procure o Ligue 180 para receber orientação e encaminhamento.'
    ]
  },
  {
    id: 'violencia-politica',
    titulo: 'Violência política',
    etiqueta: 'Forma específica de violência de gênero',
    icone: faLandmark,
    resumo:
      'É a agressão, ameaça, intimidação ou discriminação contra uma mulher com a finalidade de dificultar ou impedir sua participação na política e no exercício de funções públicas.',
    exemplos: [
      'Ameaçar ou intimidar uma candidata por ser mulher.',
      'Desqualificar sua capacidade com ofensas ou ataques misóginos.',
      'Praticar violência física, psicológica, sexual ou econômica para limitar sua atuação política.',
      'Organizar ataques e campanhas de intimidação para silenciar sua participação pública.'
    ],
    protecao: [
      'Se for seguro, preserve mensagens, publicações, gravações e informações sobre quando os fatos ocorreram.',
      'Busque orientação junto aos canais institucionais responsáveis e às autoridades competentes.',
      'Procure apoio jurídico e serviços de acolhimento quando houver ameaças ou perseguição.',
      'Em situações de risco imediato, acione o 190.'
    ]
  },
  {
    id: 'violencia-institucional',
    titulo: 'Violência institucional',
    etiqueta: 'Pode ocorrer em serviços e instituições',
    icone: faBuilding,
    resumo:
      'Pode acontecer quando uma instituição ou seus representantes submetem uma pessoa a discriminação, humilhação, constrangimento, negligência ou atendimento que viola seus direitos e sua dignidade.',
    exemplos: [
      'Humilhar ou discriminar uma mulher durante o atendimento em um serviço público.',
      'Desconsiderar sua situação ou negar atendimento de forma discriminatória.',
      'Expor a mulher a constrangimentos desnecessários ao procurar ajuda.',
      'Submetê-la a práticas que provoquem revitimização.'
    ],
    protecao: [
      'Quando possível, anote o nome do serviço, a data e as informações do atendimento.',
      'Solicite o número de protocolo e uma cópia dos documentos relacionados ao atendimento.',
      'Procure a ouvidoria do serviço ou o órgão responsável.',
      'Conforme o caso, busque orientação na Defensoria Pública, no Ministério Público ou no Disque 100.'
    ]
  },
  {
    id: 'violencia-obstetrica',
    titulo: 'Violência obstétrica',
    etiqueta: 'Relacionada ao atendimento em saúde',
    icone: faHospital,
    resumo:
      'É uma violação dos direitos da mulher durante o pré-natal, o parto, o pós-parto ou o atendimento relacionado ao abortamento. Pode envolver tratamento verbal, físico, psicológico ou sexual inadequado.',
    exemplos: [
      'Humilhar, ameaçar ou constranger a gestante durante o atendimento.',
      'Desrespeitar sua dignidade e seus direitos durante o parto ou o pós-parto.',
      'Realizar práticas sem explicação adequada ou sem respeitar seus direitos e sua autonomia.',
      'Discriminar ou negligenciar a mulher durante o atendimento de saúde.'
    ],
    protecao: [
      'Peça explicações sobre os procedimentos e informações sobre seus direitos.',
      'Quando possível, registre o nome do serviço, datas e informações do atendimento.',
      'Procure a ouvidoria da unidade de saúde ou do SUS pelo telefone 136.',
      'Também é possível buscar orientação pelo Ligue 180 ou pelo Disque 100.'
    ]
  },
  {
    id: 'assedio-trabalho',
    titulo: 'Assédio no trabalho',
    etiqueta: 'Violência e violação de direitos no ambiente profissional',
    icone: faBriefcase,
    resumo:
      'Pode ocorrer por meio de humilhações, intimidações, isolamento, ameaças ou comportamentos de natureza sexual indesejados no ambiente de trabalho ou em situações relacionadas à atividade profissional.',
    exemplos: [
      'Humilhar repetidamente uma trabalhadora ou tentar desqualificar sua capacidade.',
      'Isolar, intimidar ou ameaçar alguém para prejudicar seu trabalho.',
      'Fazer comentários ou propostas de natureza sexual indesejados.',
      'Condicionar benefícios profissionais à aceitação de investidas sexuais.'
    ],
    protecao: [
      'Se for seguro, registre datas, mensagens, e-mails e informações sobre os acontecimentos.',
      'Procure os canais de ética, recursos humanos ou ouvidoria da organização, quando existirem.',
      'Busque orientação junto ao sindicato, à Defensoria Pública ou aos órgãos de proteção ao trabalhador.',
      'O Ligue 180 também pode orientar sobre serviços de atendimento às mulheres.'
    ]
  }
]

function ListaInformativa({ itens }) {
  return (
    <ul className="space-y-3">
      {itens.map((item, indice) => (
        <li key={indice} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pink-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function SecaoViolencia({ forma }) {
  return (
    <section
      id={forma.id}
      key={forma.id}
      className="scroll-mt-24 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm md:p-9"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-2xl text-pink-600">
          <FontAwesomeIcon icon={forma.icone} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-pink-600">
            Lei Maria da Penha
          </p>
          <h3 className="text-2xl font-bold text-[#351064]">
            {forma.titulo}
          </h3>
        </div>
      </div>

      <p className="mb-7 text-base leading-7 text-slate-700">
        {forma.resumo}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-[#fff4fa] p-5">
          <h4 className="mb-4 text-lg font-bold text-[#351064]">
            Como pode acontecer?
          </h4>
          <ListaInformativa itens={forma.exemplos} />
        </div>

        <div className="rounded-2xl bg-[#f5f0ff] p-5">
          <h4 className="mb-4 text-lg font-bold text-[#351064]">
            Como buscar proteção?
          </h4>
          <ListaInformativa itens={forma.protecao} />
        </div>
      </div>
    </section>
  )
}

function SecaoManifestacao({ forma }) {
  return (
    <section
      id={forma.id}
      key={forma.id}
      className="scroll-mt-24 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:p-9"
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-700">
          <FontAwesomeIcon icon={forma.icone} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
            {forma.etiqueta}
          </p>
          <h3 className="text-2xl font-bold text-[#351064]">
            {forma.titulo}
          </h3>
        </div>
      </div>

      <p className="mb-7 text-base leading-7 text-slate-700">
        {forma.resumo}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-[#fff4fa] p-5">
          <h4 className="mb-4 text-lg font-bold text-[#351064]">
            Como pode acontecer?
          </h4>
          <ListaInformativa itens={forma.exemplos} />
        </div>

        <div className="rounded-2xl bg-[#f5f0ff] p-5">
          <h4 className="mb-4 text-lg font-bold text-[#351064]">
            Como buscar proteção?
          </h4>
          <ListaInformativa itens={forma.protecao} />
        </div>
      </div>
    </section>
  )
}

export default function Informacoes() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const id = decodeURIComponent(hash.slice(1))
    const elemento = document.getElementById(id)

    elemento?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, [hash])

  return (
    <main className="min-h-screen bg-[#fffafd] pb-16">
      <section className="bg-gradient-to-r from-[#351064] via-[#5c1bb0] to-[#8b1cc7] px-5 py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-200">
            ELLA • Informação e acolhimento
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Informações que salvam vidas
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-purple-100 md:text-lg">
            Conhecer os diferentes tipos de violência ajuda a identificar
            situações de risco, compreender seus direitos e encontrar caminhos
            para buscar apoio.
          </p>

          <a
            href="#o-que-e"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-[#4b147d] transition hover:bg-pink-100"
          >
            Começar a leitura
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-5 py-12">
        <section id="o-que-e" className="scroll-mt-24">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
              Entenda o assunto
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#351064]">
              O que é violência contra a mulher?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <p className="leading-7 text-slate-700">
                A violência contra a mulher envolve ações ou omissões que
                causam ou podem causar sofrimento, danos, ameaças, privação
                de liberdade ou violação de direitos. Ela pode ocorrer em
                relacionamentos, no ambiente familiar, no trabalho, em espaços
                públicos, em instituições e também na internet.
              </p>

              <p className="mt-4 leading-7 text-slate-700">
                No contexto doméstico e familiar, a Lei Maria da Penha
                reconhece diferentes formas de violência. Elas não precisam
                acontecer isoladamente: uma mesma situação pode envolver mais
                de uma forma ao mesmo tempo.
              </p>
            </div>

            <div className="rounded-3xl border border-pink-100 bg-[#fff0f8] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-xl text-pink-600">
                <FontAwesomeIcon icon={faCircleInfo} />
              </div>

              <h3 className="text-xl font-bold text-[#351064]">
                Um ponto importante
              </h3>

              <p className="mt-3 leading-7 text-slate-700">
                A violência não precisa deixar marcas físicas para ser real.
                Ameaças, humilhações, controle financeiro, perseguição e
                constrangimentos também podem representar violência.
              </p>
            </div>
          </div>
        </section>

        <section id="fatores" className="scroll-mt-24">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
              Compreender para prevenir
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#351064]">
              Por que a violência acontece?
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <p className="leading-7 text-slate-700">
              Não existe uma única explicação para todos os casos. A violência
              contra mulheres está relacionada a fatores individuais,
              familiares, comunitários e sociais. A desigualdade de gênero,
              relações de poder desequilibradas e ideias que normalizam o
              controle sobre as mulheres estão entre os fatores estruturais
              associados ao problema.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  titulo: 'Desigualdade de gênero',
                  texto:
                    'Crenças que tratam mulheres como inferiores ou limitam sua autonomia.'
                },
                {
                  titulo: 'Controle e poder',
                  texto:
                    'Tentativas de controlar decisões, relacionamentos, dinheiro e liberdade.'
                },
                {
                  titulo: 'Normalização da violência',
                  texto:
                    'Atitudes que justificam agressões, ameaças, humilhações ou comportamentos abusivos.'
                },
                {
                  titulo: 'Discriminação',
                  texto:
                    'Desigualdades e preconceitos que podem aumentar a vulnerabilidade de determinados grupos.'
                },
                {
                  titulo: 'Tolerância social',
                  texto:
                    'O silêncio, a omissão e a falta de resposta adequada podem favorecer a continuidade da violência.'
                },
                {
                  titulo: 'Desigualdade de recursos',
                  texto:
                    'A dependência econômica e a dificuldade de acesso à proteção podem dificultar a saída de situações violentas.'
                }
              ].map((fator) => (
                <article
                  key={fator.titulo}
                  className="rounded-2xl bg-[#fff4fa] p-5"
                >
                  <h3 className="font-bold text-[#351064]">
                    {fator.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {fator.texto}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border-l-4 border-pink-500 bg-[#f8f2ff] p-5">
              <p className="font-semibold text-[#351064]">
                A responsabilidade nunca é da vítima.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Roupas, comportamento, escolhas, consumo de álcool, situação
                financeira ou permanência em um relacionamento não justificam
                a violência. A responsabilidade pela agressão é de quem a
                pratica. Fatores de risco ajudam a compreender o problema,
                mas não desculpam o agressor.
              </p>
            </div>
          </div>
        </section>

        <section id="formas-legais" className="scroll-mt-24">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
              Lei Maria da Penha
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#351064]">
              Os seis tipos previstos na lei
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-700">
              O artigo 7º da Lei nº 11.340/2006 apresenta seis formas de
              violência doméstica e familiar contra a mulher. Selecione uma
              seção para conhecer exemplos e orientações de proteção.
            </p>
          </div>

          <nav
            aria-label="Navegação pelos tipos de violência"
            className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          >
            {formasLegais.map((forma) => (
              <a
                key={forma.id}
                href={`#${forma.id}`}
                className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-pink-100 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-pink-300 hover:bg-[#fff0f8]"
              >
                <FontAwesomeIcon
                  icon={forma.icone}
                  className="mb-3 text-2xl text-pink-600"
                />
                <span className="text-sm font-bold text-[#351064]">
                  {forma.titulo}
                </span>
              </a>
            ))}
          </nav>

          <div className="space-y-6">
            {formasLegais.map((forma) => (
              <SecaoViolencia key={forma.id} forma={forma} />
            ))}
          </div>
        </section>

        <section id="outras-manifestacoes" className="scroll-mt-24">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
              Outros contextos e manifestações
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#351064]">
              A violência também pode acontecer em outros espaços
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-700">
              Algumas manifestações não são uma categoria adicional do artigo
              7º da Lei Maria da Penha. Elas possuem características e
              contextos próprios e podem se relacionar com uma ou mais formas
              de violência já apresentadas.
            </p>
          </div>

          <nav
            aria-label="Navegação por outras manifestações de violência"
            className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            {outrasManifestacoes.map((forma) => (
              <a
                key={forma.id}
                href={`#${forma.id}`}
                className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-purple-100 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-purple-300 hover:bg-[#f5f0ff]"
              >
                <FontAwesomeIcon
                  icon={forma.icone}
                  className="mb-3 text-2xl text-purple-700"
                />
                <span className="text-sm font-bold text-[#351064]">
                  {forma.titulo}
                </span>
              </a>
            ))}
          </nav>

          <div className="space-y-6">
            {outrasManifestacoes.map((forma) => (
              <SecaoManifestacao key={forma.id} forma={forma} />
            ))}
          </div>
        </section>

        <section id="procurar-ajuda" className="scroll-mt-24">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
              Você não precisa enfrentar isso sozinha
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#351064]">
              Onde procurar ajuda?
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-700">
              Existem serviços públicos e redes de atendimento que oferecem
              orientação, acolhimento, proteção e encaminhamento.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl bg-[#fce8f4] p-6 md:p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-200 text-2xl text-pink-700">
                <FontAwesomeIcon icon={faPhone} />
              </div>

              <h3 className="text-2xl font-bold text-[#351064]">
                Ligue 180
              </h3>

              <p className="mt-3 leading-7 text-slate-700">
                Central de Atendimento à Mulher. Oferece orientação sobre
                direitos, informações sobre serviços especializados, acolhimento
                e registro de denúncias. O atendimento é gratuito e funciona
                24 horas por dia, todos os dias da semana.
              </p>

              <p className="mt-3 font-semibold text-[#351064]">
                WhatsApp: (61) 9610-0180
              </p>

              <a
                href="https://www.gov.br/mulheres/pt-br/ligue180"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-bold text-pink-700 underline underline-offset-4"
              >
                Conheça o Ligue 180
                <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </article>

            <article className="rounded-3xl bg-[#eee5ff] p-6 md:p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-200 text-2xl text-purple-800">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>

              <h3 className="text-2xl font-bold text-[#351064]">
                Polícia Militar — 190
              </h3>

              <p className="mt-3 leading-7 text-slate-700">
                Deve ser acionada quando a violência estiver acontecendo ou
                houver perigo imediato e necessidade de intervenção policial.
                Não é o mesmo serviço que o Ligue 180.
              </p>

              <a
                href="tel:190"
                className="mt-5 inline-flex items-center gap-2 font-bold text-purple-800 underline underline-offset-4"
              >
                Ligar para 190
                <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </article>

            <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#351064]">
                Delegacias e serviços especializados
              </h3>
              <p className="mt-3 leading-7 text-slate-700">
                Delegacias Especializadas de Atendimento à Mulher, centros de
                referência, unidades de saúde, Defensoria Pública e outros
                serviços da rede podem oferecer atendimento e encaminhamento.
                Também é possível procurar uma delegacia comum.
              </p>
            </article>

            <article className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#351064]">
                Disque 100
              </h3>
              <p className="mt-3 leading-7 text-slate-700">
                Canal para denúncias de violações de direitos humanos. Pode ser
                especialmente importante quando crianças e adolescentes
                estiverem em situação de risco.
              </p>
            </article>
          </div>

          <div className="mt-7 rounded-3xl bg-[#351064] p-6 text-white md:p-8">
            <h3 className="text-2xl font-bold">
              Algumas orientações importantes
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <p className="leading-7 text-purple-100">
                Você não precisa ter certeza de qual é a classificação da
                violência para procurar orientação.
              </p>

              <p className="leading-7 text-purple-100">
                Pedir ajuda não obriga você a resolver tudo de uma só vez.
                Respeitar seu tempo e sua segurança é importante.
              </p>

              <p className="leading-7 text-purple-100">
                Se alguém compartilhar uma situação com você, escute sem
                julgamentos, respeite suas decisões e ajude a encontrar apoio.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-pink-100 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#351064]">
            Fontes e materiais para consulta
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            As informações desta página foram organizadas com base em
            legislação e materiais de órgãos públicos e instituições de
            referência. Consulte as fontes para conhecer os textos completos
            e obter orientações atualizadas.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              {
                nome: 'Lei Maria da Penha — texto legal',
                url: 'https://legis.senado.gov.br/norma/572125/publicacao/34620955'
              },
              {
                nome: 'Ministério das Mulheres — seis formas previstas na Lei Maria da Penha',
                url: 'https://www.gov.br/mulheres/pt-br/central-de-conteudos/noticias/2026/agosto-defeso-eleitoral/lei-maria-da-penha-conheca-os-seis-tipos-de-violencia-domestica-e-familiar-contra-a-mulher-previstos-na-lei'
              },
              {
                nome: 'Ministério das Mulheres — violência digital',
                url: 'https://www.gov.br/mulheres/pt-br/central-de-conteudos/campanhas/2026/o-digital-e-nosso-lugar'
              },
              {
                nome: 'Organização Mundial da Saúde — violência contra mulheres',
                url: 'https://www.who.int/news-room/fact-sheets/detail/violence-against-women'
              },
              {
                nome: 'Ministério das Mulheres — Ligue 180',
                url: 'https://www.gov.br/mulheres/pt-br/ligue180'
              },
              {
                nome: 'Ministério da Saúde — violência obstétrica',
                url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-mulher/saude-materna'
              },
              {
                nome: 'Ministério dos Direitos Humanos — violência política',
                url: 'https://www.gov.br/mdh/pt-br/assuntos/mais-mulheres-na-politica/violencia-politica'
              },
              {
                nome: 'Governo Federal — assédio moral e sexual no trabalho',
                url: 'https://www.gov.br/mds/pt-br/acesso-a-informacao/governanca/integridade/campanhas/etica-assedio-moral-e-assedio-sexual-no-ambiente-de-trabalho'
              }
            ].map((fonte) => (
              <li key={fonte.url}>
                <a
                  href={fonte.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-purple-800 underline decoration-pink-300 underline-offset-4 hover:text-pink-700"
                >
                  {fonte.nome}
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-7 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">
            Esta página tem finalidade informativa e educativa. Ela não
            substitui orientação jurídica, atendimento de saúde ou avaliação
            individual por profissionais e serviços especializados.
          </p>
        </section>
      </div>
    </main>
  )
}