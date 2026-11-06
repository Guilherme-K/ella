import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowDown, faArrowLeft, faArrowUp, faBell, faCalendarDays, faChartColumn,
    faChevronDown, faChevronRight, faFileLines, faGear, faHeart, faHouse,
    faMagnifyingGlass, faRightFromBracket, faShieldHalved, faUser, faUserPlus, faUsers,
} from '@fortawesome/free-solid-svg-icons';
import imagemMulheres from '../assets/mulheres2.png';
import Footer from '../components/Footer';

// TEMPORÁRIO: tudo abaixo são dados de exemplo. Trocar pelos dados da API.
// TODO: esta página só pode ser acessada por quem tem papel de admin
// (proteger a rota no front e conferir o papel no back).

const menu = [
    { nome: 'Dashboard', icone: faHouse, ativo: true },
    { nome: 'Usuárias', icone: faUsers },
    { nome: 'Voluntárias', icone: faHeart },
    { nome: 'Eventos', icone: faCalendarDays },
    { nome: 'Conteúdos', icone: faFileLines },
    { nome: 'Denúncias', icone: faShieldHalved },
    { nome: 'Relatórios', icone: faChartColumn },
    { nome: 'Configurações', icone: faGear },
];

const estatisticas = [
    { icone: faUsers, valor: '1.248', rotulo: 'Usuárias cadastradas', variacao: '+12% este mês', sobe: true },
    { icone: faHeart, valor: '342', rotulo: 'Voluntárias ativas', variacao: '+8% este mês', sobe: true },
    { icone: faCalendarDays, valor: '86', rotulo: 'Eventos realizados', variacao: '+20% este mês', sobe: true },
    { icone: faShieldHalved, valor: '23', rotulo: 'Denúncias recebidas', variacao: '-15% este mês', sobe: false },
];

const acoesRapidas = [
    { texto: 'Adicionar usuária', icone: faUserPlus },
    { texto: 'Cadastrar voluntária', icone: faHeart },
    { texto: 'Criar evento', icone: faCalendarDays },
    { texto: 'Publicar conteúdo', icone: faFileLines },
    { texto: 'Ver denúncias', icone: faShieldHalved },
];

const atividades = [
    { icone: faUser, titulo: 'Nova usuária cadastrada', detalhe: 'Maria Silva', tempo: 'Há 5 minutos' },
    { icone: faHeart, titulo: 'Voluntária se inscreveu', detalhe: 'Ana Costa', tempo: 'Há 12 minutos' },
    { icone: faCalendarDays, titulo: 'Evento publicado', detalhe: 'Roda de Conversa - Autocuidado', tempo: 'Há 1 hora' },
    { icone: faShieldHalved, titulo: 'Nova denúncia recebida', detalhe: 'Relato de violência psicológica', tempo: 'Há 2 horas' },
    { icone: faFileLines, titulo: 'Conteúdo publicado', detalhe: 'Dicas de segurança', tempo: 'Há 3 horas' },
];

const solicitacoes = [
    { tipo: 'Usuária', nome: 'Juliana Ferreira', email: 'juliana@email.com', data: '10/05/2025', status: 'Pendente' },
    { tipo: 'Voluntária', nome: 'Carla Menezes', email: 'carla@email.com', data: '09/05/2025', status: 'Aprovada' },
    { tipo: 'Evento', nome: 'Oficina de Empoderamento', email: 'contato@evento.com', data: '08/05/2025', status: 'Pendente' },
    { tipo: 'Usuária', nome: 'Renata Souza', email: 'renata@email.com', data: '08/05/2025', status: 'Em análise' },
    { tipo: 'Voluntária', nome: 'Beatriz Lima', email: 'beatriz@email.com', data: '07/05/2025', status: 'Aprovada' },
];

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
const series = [
    { nome: 'Usuárias', cor: '#e11d8f', valores: [350, 650, 800, 950, 1150, 1350] },
    { nome: 'Voluntárias', cor: '#6d28d9', valores: [150, 350, 450, 550, 700, 900] },
    { nome: 'Eventos', cor: '#f9a8d4', valores: [50, 150, 250, 300, 380, 450] },
];

const violencia = [
    { nome: 'Psicológica', pct: 56, cor: '#e11d8f' },
    { nome: 'Física', pct: 18, cor: '#6d28d9' },
    { nome: 'Sexual', pct: 12, cor: '#f9a8d4' },
    { nome: 'Patrimonial', pct: 8, cor: '#a855f7' },
    { nome: 'Moral', pct: 6, cor: '#d8b4fe' },
];

const corTipo = {
    'Usuária': 'bg-pink-100 text-pink-700',
    'Voluntária': 'bg-violet-100 text-violet-700',
    'Evento': 'bg-fuchsia-100 text-fuchsia-700',
};
const corStatus = {
    'Pendente': 'bg-amber-100 text-amber-700',
    'Aprovada': 'bg-emerald-100 text-emerald-700',
    'Em análise': 'bg-violet-100 text-violet-700',
};

const card = 'rounded-xl bg-white p-5 shadow-sm';

function GraficoLinhas() {
    const largura = 560;
    const altura = 200;
    const esquerda = 40;
    const base = 30;
    const x = (i) => esquerda + (i * (largura - esquerda - 10)) / (meses.length - 1);
    const y = (v) => altura - base - (v / 1500) * (altura - base - 10);

    return (
        <svg viewBox={`0 0 ${largura} ${altura}`} className="w-full" role="img"
            aria-label="Crescimento de usuárias, voluntárias e eventos nos últimos 6 meses">
            {[0, 300, 600, 900, 1200, 1500].map((v) => (
                <g key={v}>
                    <line x1={esquerda} x2={largura - 10} y1={y(v)} y2={y(v)} stroke="#ede9fe" />
                    <text x={esquerda - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#6b7280">{v}</text>
                </g>
            ))}
            {meses.map((m, i) => (
                <text key={m} x={x(i)} y={altura - 10} textAnchor="middle" fontSize="9" fill="#6b7280">{m}</text>
            ))}
            {series.map((s) => (
                <g key={s.nome}>
                    <polyline fill="none" stroke={s.cor} strokeWidth="2"
                        points={s.valores.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
                    {s.valores.map((v, i) => (
                        <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={s.cor} />
                    ))}
                </g>
            ))}
        </svg>
    );
}

function GraficoRosca() {
    const raio = 40;
    const circunferencia = 2 * Math.PI * raio;
    const inicios = violencia.map((_, i) =>
        violencia.slice(0, i).reduce((soma, item) => soma + item.pct, 0)
    );

    return (
        <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0" role="img"
            aria-label="Distribuição dos tipos de violência registrados">
            <g transform="rotate(-90 50 50)">
                {violencia.map((v, i) => {
                    const tamanho = (v.pct / 100) * circunferencia;
                    return (
                        <circle key={v.nome} cx="50" cy="50" r={raio} fill="none" stroke={v.cor}
                            strokeWidth="14"
                            strokeDasharray={`${tamanho} ${circunferencia - tamanho}`}
                            strokeDashoffset={-(inicios[i] / 100) * circunferencia} />
                    );
                })}
            </g>
            <text x="50" y="50" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3b1a6e">
                {violencia[0].pct}%
            </text>
            <text x="50" y="60" textAnchor="middle" fontSize="5" fill="#6b7280">Total de registros</text>
        </svg>
    );
}

function AdminDashboard() {
    return (
        <div className="flex min-h-screen flex-col bg-[#f5f0ff] text-[#2e1065]">
            <header className="flex items-center gap-4 bg-white px-4 py-2 shadow-sm">
                <button type="button" aria-label="Voltar">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                

                <div className="relative mx-auto hidden w-full max-w-xl md:block">
                    <FontAwesomeIcon icon={faMagnifyingGlass}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7e22ce]" />
                    <input type="search" placeholder="Buscar usuária, voluntária, evento ou conteúdo..."
                        className="w-full rounded-lg bg-[#f3e8ff] py-2 pl-9 pr-4 text-sm" />
                </div>

                <div className="ml-auto flex items-center gap-5">
                    <button type="button" aria-label="Notificações" className="relative text-[#4c1d95]">
                        <FontAwesomeIcon icon={faBell} />
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-pink-500" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3b1a6e] text-white">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <div className="hidden leading-tight sm:block">
                            <p className="text-sm font-semibold">Admin ELLA</p>
                            <p className="text-xs text-gray-500">Administradora</p>
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="relative hidden w-60 shrink-0 overflow-hidden bg-gradient-to-b from-[#3b1a6e] to-[#2e0a63] lg:block">
                    <nav className="relative z-10 space-y-1 p-3">
                        {menu.map((item) => (
                            <button key={item.nome} type="button"
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white ${item.ativo ? 'bg-[#7e3fc9]' : 'hover:bg-white/10'}`}>
                                <FontAwesomeIcon icon={item.icone} className="w-4" />
                                {item.nome}
                            </button>
                        ))}
                        <hr className="my-3 border-white/20" />
                        <button type="button"
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white hover:bg-white/10">
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                            Sair
                        </button>
                    </nav>
                    <img src={imagemMulheres} alt=""
                        className="pointer-events-none absolute bottom-0 left-0 h-72 w-full object-cover object-left-top" />
                </aside>

                <main className="min-w-0 flex-1 p-6">
                    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Olá, Admin!</h1>
                            <p className="text-sm">
                                Aqui você acompanha o que acontece na plataforma ELLA.<br />
                                Gerencie usuárias, voluntárias, eventos e muito mais.
                            </p>
                        </div>
                        <div className="flex items-center justify-between gap-4 rounded-xl bg-pink-100 px-5 py-4 xl:w-[28rem]">
                            <img src="/Logo.png" alt="" className="h-10" />
                            <div className="mr-auto">
                                <p className="font-semibold">Juntas somos mais fortes.</p>
                                <p className="text-xs">Mais apoio, mais histórias, mais recomeços.</p>
                            </div>
                            <FontAwesomeIcon icon={faHeart} className="text-pink-500" />
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
                        <div className="min-w-0 space-y-6">
                            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo">
                                {estatisticas.map((e) => (
                                    <div key={e.rotulo} className={card}>
                                        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                            <FontAwesomeIcon icon={e.icone} />
                                        </span>
                                        <p className="text-3xl font-bold">{e.valor}</p>
                                        <p className="text-sm">{e.rotulo}</p>
                                        <p className="mt-3 text-xs font-semibold text-emerald-600">
                                            <FontAwesomeIcon icon={e.sobe ? faArrowUp : faArrowDown} className="mr-1" />
                                            {e.variacao}
                                        </p>
                                    </div>
                                ))}
                            </section>

                            <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                                <section className={card}>
                                    <h2 className="mb-2 font-bold">Crescimento da plataforma</h2>
                                    <ul className="mb-2 flex flex-wrap gap-4 text-xs">
                                        {series.map((s) => (
                                            <li key={s.nome} className="flex items-center gap-1">
                                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.cor }} />
                                                {s.nome}
                                            </li>
                                        ))}
                                    </ul>
                                    <GraficoLinhas />
                                </section>

                                <section className={card}>
                                    <h2 className="mb-4 font-bold">Tipos de violência</h2>
                                    <div className="flex flex-wrap items-center justify-center gap-4">
                                        <GraficoRosca />
                                        <ul className="space-y-2 text-xs">
                                            {violencia.map((v) => (
                                                <li key={v.nome} className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: v.cor }} />
                                                    <span className="w-20">{v.nome}</span>
                                                    <span className="font-semibold">{v.pct}%</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                            </div>

                            <section className={card}>
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="font-bold">Últimas solicitações</h2>
                                    <button type="button" className="text-sm font-semibold text-[#5b21b6]">Ver todas</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[640px] text-left text-sm">
                                        <thead className="text-xs text-gray-500">
                                            <tr>
                                                <th className="py-2">Tipo</th>
                                                <th>Nome</th>
                                                <th>E-mail</th>
                                                <th>Data</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {solicitacoes.map((s) => (
                                                <tr key={s.email} className="border-t border-violet-100">
                                                    <td className="py-3">
                                                        <span className={`rounded-full px-3 py-1 text-xs ${corTipo[s.tipo]}`}>{s.tipo}</span>
                                                    </td>
                                                    <td>{s.nome}</td>
                                                    <td>{s.email}</td>
                                                    <td>{s.data}</td>
                                                    <td>
                                                        <span className={`rounded-full px-3 py-1 text-xs ${corStatus[s.status]}`}>{s.status}</span>
                                                    </td>
                                                    <td>
                                                        <button type="button"
                                                            className="rounded-md bg-[#5b21b6] px-4 py-1 text-xs font-semibold text-white">
                                                            Ver
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <section className={card}>
                                <h2 className="mb-3 font-bold">Ações rápidas</h2>
                                <ul className="space-y-2">
                                    {acoesRapidas.map((a) => (
                                        <li key={a.texto}>
                                            <button type="button"
                                                className="flex w-full items-center gap-3 rounded-lg bg-pink-50 px-3 py-3 text-left text-sm">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                                    <FontAwesomeIcon icon={a.icone} />
                                                </span>
                                                <span className="mr-auto">{a.texto}</span>
                                                <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-400" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className={card}>
                                <h2 className="mb-3 font-bold">Atividade recente</h2>
                                <ul className="space-y-4">
                                    {atividades.map((a) => (
                                        <li key={a.titulo} className="flex items-start gap-3">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                                <FontAwesomeIcon icon={a.icone} />
                                            </span>
                                            <div className="mr-auto">
                                                <p className="text-sm font-semibold">{a.titulo}</p>
                                                <p className="text-xs text-gray-500">{a.detalhe}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{a.tempo}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default AdminDashboard;