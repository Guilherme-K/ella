import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays, faChevronRight, faFileLines, faHeart, faShieldHalved, faUserPlus, faUsers,
} from '@fortawesome/free-solid-svg-icons';

// TEMPORÁRIO: dados de exemplo. Trocar pelos dados da API.
// TODO: só admin pode abrir esta página (proteger a rota e conferir o papel no back).

const estatisticas = [
    { icone: faUsers, valor: '1.248', rotulo: 'Usuárias cadastradas', variacao: '+12%', sobe: true },
    { icone: faHeart, valor: '342', rotulo: 'Voluntárias ativas', variacao: '+8%', sobe: true },
    { icone: faCalendarDays, valor: '86', rotulo: 'Eventos realizados', variacao: '+20%', sobe: true },
    { icone: faShieldHalved, valor: '23', rotulo: 'Denúncias recebidas', variacao: '-15%', sobe: false },
];

const acoesRapidas = [
    { texto: 'Adicionar usuária', icone: faUserPlus },
    { texto: 'Cadastrar voluntária', icone: faHeart },
    { texto: 'Criar evento', icone: faCalendarDays },
    { texto: 'Publicar conteúdo', icone: faFileLines },
    { texto: 'Ver denúncias', icone: faShieldHalved },
];

const atividades = [
    { titulo: 'Nova usuária cadastrada', detalhe: 'Maria Silva', tempo: 'há 5 min' },
    { titulo: 'Voluntária se inscreveu', detalhe: 'Ana Costa', tempo: 'há 12 min' },
    { titulo: 'Evento publicado', detalhe: 'Roda de Conversa - Autocuidado', tempo: 'há 1 h' },
    { titulo: 'Nova denúncia recebida', detalhe: 'Relato de violência psicológica', tempo: 'há 2 h' },
    { titulo: 'Conteúdo publicado', detalhe: 'Dicas de segurança', tempo: 'há 3 h' },
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
    { nome: 'Usuárias', cor: '#e11d8f', largura: 2.5, valores: [350, 650, 800, 950, 1150, 1350] },
    { nome: 'Voluntárias', cor: '#6d28d9', largura: 1.75, valores: [150, 350, 450, 550, 700, 900] },
    { nome: 'Eventos', cor: '#d28bb8', largura: 1.75, valores: [50, 150, 250, 300, 380, 450] },
];

const violencia = [
    { nome: 'Psicológica', pct: 56 },
    { nome: 'Física', pct: 18 },
    { nome: 'Sexual', pct: 12 },
    { nome: 'Patrimonial', pct: 8 },
    { nome: 'Moral', pct: 6 },
];

const corStatus = {
    'Pendente': 'bg-amber-500',
    'Aprovada': 'bg-emerald-500',
    'Em análise': 'bg-violet-500',
};

const card = 'rounded-2xl border border-violet-100 bg-white p-6';
const titulo = 'mb-4 font-serif text-lg text-[#2e1065]';

function GraficoLinhas() {
    const largura = 560;
    const altura = 200;
    const esquerda = 36;
    const direita = 80; // espaço para o nome de cada linha no final
    const base = 28;
    const x = (i) => esquerda + (i * (largura - esquerda - direita)) / (meses.length - 1);
    const y = (v) => altura - base - (v / 1500) * (altura - base - 10);
    const ultimo = meses.length - 1;

    return (
        <svg viewBox={`0 0 ${largura} ${altura}`} className="w-full" role="img"
            aria-label="Crescimento de usuárias, voluntárias e eventos nos últimos 6 meses">
            {[0, 500, 1000, 1500].map((v) => (
                <g key={v}>
                    <line x1={esquerda} x2={largura - direita} y1={y(v)} y2={y(v)} stroke="#ede9fe" strokeDasharray="3 4" />
                    <text x={esquerda - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#6b7280">{v}</text>
                </g>
            ))}
            {meses.map((m, i) => (
                <text key={m} x={x(i)} y={altura - 8} textAnchor="middle" fontSize="9" fill="#6b7280">{m}</text>
            ))}
            {series.map((s) => (
                <g key={s.nome}>
                    <polyline fill="none" stroke={s.cor} strokeWidth={s.largura} strokeLinejoin="round"
                        points={s.valores.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
                    <circle cx={x(ultimo)} cy={y(s.valores[ultimo])} r="3.5" fill={s.cor} />
                    <text x={x(ultimo) + 9} y={y(s.valores[ultimo]) + 3} fontSize="9" fontWeight="600" fill={s.cor}>
                        {s.nome}
                    </text>
                </g>
            ))}
        </svg>
    );
}

function AdminDashboard() {
    const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <>
            <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm capitalize text-[#7e22ce]">{hoje}</p>
                    <h1 className="font-serif text-4xl text-[#2e1065]">Olá, Admin</h1>
                    <p className="mt-1 max-w-md text-sm text-gray-600">
                        Aqui você acompanha o que acontece na plataforma ELLA.
                    </p>
                </div>
                <p className="border-l-2 border-pink-400 pl-4 font-serif italic text-[#4c1d95]">
                    Juntas somos mais fortes.
                    <span className="block font-sans text-xs not-italic text-gray-500">
                        Mais apoio, mais histórias, mais recomeços.
                    </span>
                </p>
            </header>

            <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
                <div className="min-w-0 space-y-6">
                    <section aria-label="Resumo"
                        className="grid grid-cols-2 rounded-2xl border border-violet-100 bg-white xl:grid-cols-4 xl:divide-x xl:divide-violet-100">
                        {estatisticas.map((e) => (
                            <div key={e.rotulo} className="p-5">
                                <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                                    <FontAwesomeIcon icon={e.icone} className="text-pink-500" />
                                    {e.rotulo}
                                </p>
                                <p className="mt-2 font-serif text-4xl tabular-nums text-[#2e1065]">{e.valor}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    <span className="font-semibold text-[#5b21b6]">{e.sobe ? '↑' : '↓'} {e.variacao}</span>{' '}
                                    em relação ao mês anterior
                                </p>
                            </div>
                        ))}
                    </section>

                    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                        <section className={card}>
                            <h2 className={titulo}>Crescimento da plataforma</h2>
                            <GraficoLinhas />
                        </section>

                        <section className={card}>
                            <h2 className={titulo}>Tipos de violência</h2>
                            <ul className="space-y-3">
                                {violencia.map((v, i) => (
                                    <li key={v.nome}>
                                        <div className="mb-1 flex justify-between text-sm">
                                            <span>{v.nome}</span>
                                            <span className="tabular-nums text-gray-500">{v.pct}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-violet-50">
                                            <div className={`h-2 rounded-full ${i === 0 ? 'bg-pink-600' : 'bg-violet-300'}`}
                                                style={{ width: `${v.pct}%` }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-gray-500">
                                {violencia[0].nome} é o tipo mais registrado ({violencia[0].pct}% do total).
                            </p>
                        </section>
                    </div>

                    <section className={card}>
                        <div className="mb-3 flex items-baseline justify-between">
                            <h2 className="font-serif text-lg text-[#2e1065]">Últimas solicitações</h2>
                            <button type="button" className="text-sm text-[#5b21b6] underline underline-offset-4">Ver todas</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="text-xs uppercase tracking-wide text-gray-400">
                                    <tr>
                                        <th className="py-2 font-medium">Tipo</th>
                                        <th className="font-medium">Nome</th>
                                        <th className="font-medium">E-mail</th>
                                        <th className="font-medium">Data</th>
                                        <th className="font-medium">Status</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitacoes.map((s) => (
                                        <tr key={s.email} className="border-t border-violet-100 hover:bg-violet-50/50">
                                            <td className="py-3 text-gray-500">{s.tipo}</td>
                                            <td className="font-medium">{s.nome}</td>
                                            <td className="text-gray-600">{s.email}</td>
                                            <td className="tabular-nums text-gray-600">{s.data}</td>
                                            <td>
                                                <span className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${corStatus[s.status]}`} />
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <button type="button" className="text-[#5b21b6] underline underline-offset-4">Ver</button>
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
                        <h2 className={titulo}>Ações rápidas</h2>
                        <ul className="divide-y divide-violet-100">
                            {acoesRapidas.map((a) => (
                                <li key={a.texto}>
                                    <button type="button" className="flex w-full items-center gap-3 py-3 text-left text-sm hover:text-[#7e22ce]">
                                        <FontAwesomeIcon icon={a.icone} className="w-4 text-pink-500" />
                                        <span className="mr-auto">{a.texto}</span>
                                        <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-300" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className={card}>
                        <h2 className={titulo}>Atividade recente</h2>
                        <ol className="border-l border-violet-200">
                            {atividades.map((a) => (
                                <li key={a.titulo} className="relative pb-5 pl-5 last:pb-0">
                                    <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-pink-500 ring-4 ring-white" />
                                    <p className="text-sm font-medium">{a.titulo}</p>
                                    <p className="text-xs text-gray-500">{a.detalhe} · {a.tempo}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;