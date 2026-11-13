import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell, faBrain, faCalendarDays, faChevronRight, faComments, faDownload,
    faHeart, faRotate, faUserGear, faUserPlus, faUsers,
} from '@fortawesome/free-solid-svg-icons';

import Avatar from '../components/Avatar';
import { BASE_URL } from '../services/httpClient';
import { userService } from '../services/userService';

// Dados reais das contas cadastradas. O projeto ainda não possui eventos,
// denúncias, conteúdos ou atendimentos persistidos, então o dashboard mostra
// apenas o que existe hoje no banco: contas, tipos de conta e preenchimento
// de perfil.

const PAPEIS = {
    usuaria: { rotulo: 'Usuária', cor: '#e11d8f', classe: 'bg-pink-100 text-pink-700' },
    voluntaria: { rotulo: 'Voluntária', cor: '#6d28d9', classe: 'bg-violet-100 text-violet-700' },
    psicologa: { rotulo: 'Psicóloga', cor: '#a21caf', classe: 'bg-fuchsia-100 text-fuchsia-700' },
    admin: { rotulo: 'Admin', cor: '#2e1065', classe: 'bg-violet-950 text-white' },
};

const acoesRapidas = [
    { texto: 'Ver todas as contas', icone: faUsers, to: '/contas' },
    { texto: 'Abrir chats', icone: faComments, to: '/admin/chats' },
    { texto: 'Editar meu perfil', icone: faUserGear, to: '/admin/perfil' },
    { texto: 'Cadastrar nova conta', icone: faUserPlus, to: '/cadastro' },
];

const card = 'rounded-2xl border border-violet-100 bg-white p-6';
const titulo = 'mb-4 font-serif text-lg text-[#2e1065]';

function lerData(valor) {
    const data = new Date(valor);

    return Number.isNaN(data.getTime()) ? null : data;
}

function formatarData(valor) {
    const data = lerData(valor);

    return data ? data.toLocaleDateString('pt-BR') : '—';
}

const formatadorRelativo = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

function tempoRelativo(valor) {
    const data = lerData(valor);

    if (!data) return '—';

    const diferenca = data.getTime() - Date.now();
    const minutos = Math.round(diferenca / 60000);

    if (Math.abs(minutos) < 60) return formatadorRelativo.format(minutos, 'minute');

    const horas = Math.round(diferenca / 3600000);

    if (Math.abs(horas) < 24) return formatadorRelativo.format(horas, 'hour');

    const dias = Math.round(diferenca / 86400000);

    if (Math.abs(dias) < 30) return formatadorRelativo.format(dias, 'day');

    const meses = Math.round(diferenca / 2592000000);

    if (Math.abs(meses) < 12) return formatadorRelativo.format(meses, 'month');

    return formatadorRelativo.format(Math.round(diferenca / 31536000000), 'year');
}

function papelDe(usuario) {
    // O papel (role) é sempre "usuaria" para as novas voluntárias e
    // psicólogas; o tipo de conta (accountType) é o que diferencia a exibição
    // no painel. Contas antigas com role própria continuam sendo reconhecidas.
    const role = String(usuario.role ?? usuario.tipo ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (role === 'admin') return 'admin';
    if (role === 'voluntaria' || role === 'psicologa') return role;

    const tipo = String(usuario.accountType ?? usuario.tipoConta ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (tipo === 'voluntaria' || tipo === 'psicologa') return tipo;

    return 'usuaria';
}

function contarPorPapel(usuarios) {
    return usuarios.reduce(
        (contagem, usuario) => {
            contagem[papelDe(usuario)] += 1;
            return contagem;
        },
        { usuaria: 0, voluntaria: 0, psicologa: 0, admin: 0 },
    );
}

function calcularResumo(usuarios) {
    const total = usuarios.length;
    const porPapel = contarPorPapel(usuarios);
    const agora = Date.now();
    const inicio30 = agora - 30 * 86400000;
    const inicio60 = agora - 60 * 86400000;

    const novas30 = usuarios.filter((usuario) => {
        const data = lerData(usuario.createdAt);
        return data && data.getTime() >= inicio30;
    }).length;

    const novas30Anteriores = usuarios.filter((usuario) => {
        const data = lerData(usuario.createdAt);
        return data && data.getTime() >= inicio60 && data.getTime() < inicio30;
    }).length;

    return { total, porPapel, novas30, novas30Anteriores };
}

function percentual(parte, total) {
    return total > 0 ? Math.round((parte / total) * 100) : 0;
}

function criarSeries(usuarios) {
    const agora = new Date();
    const meses = [];

    for (let i = 5; i >= 0; i -= 1) {
        const inicio = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
        const fim = new Date(agora.getFullYear(), agora.getMonth() - i + 1, 1);

        meses.push({
            rotulo: inicio.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
            fim,
        });
    }

    const series = [
        { nome: 'Contas', cor: '#e11d8f', largura: 2.5, valores: [] },
        { nome: 'Voluntárias', cor: '#6d28d9', largura: 1.75, valores: [] },
        { nome: 'Psicólogas', cor: '#d28bb8', largura: 1.75, valores: [] },
    ];

    for (const mes of meses) {
        const cadastradasAte = usuarios.filter((usuario) => {
            const data = lerData(usuario.createdAt);
            return data && data < mes.fim;
        });

        series[0].valores.push(cadastradasAte.length);
        series[1].valores.push(cadastradasAte.filter((usuario) => papelDe(usuario) === 'voluntaria').length);
        series[2].valores.push(cadastradasAte.filter((usuario) => papelDe(usuario) === 'psicologa').length);
    }

    return { meses: meses.map((mes) => mes.rotulo), series };
}

function perfilPreenchido(usuario) {
    const preenchidos = [
        Boolean(usuario.bio),
        Boolean(usuario.city ?? usuario.cidade),
        Boolean(usuario.phone ?? usuario.telefone),
    ].filter(Boolean).length;

    if (preenchidos === 3) return { rotulo: 'Completo', classe: 'bg-emerald-500' };
    if (preenchidos === 0) return { rotulo: 'Incompleto', classe: 'bg-amber-500' };

    return { rotulo: 'Parcial', classe: 'bg-violet-500' };
}

function calcularPreenchimento(usuarios) {
    const total = usuarios.length;
    const itens = [
        { rotulo: 'Com foto de perfil', quantidade: usuarios.filter((u) => Boolean(u.photo)).length },
        { rotulo: 'Com bio', quantidade: usuarios.filter((u) => Boolean(u.bio)).length },
        { rotulo: 'Com cidade', quantidade: usuarios.filter((u) => Boolean(u.city ?? u.cidade)).length },
        { rotulo: 'Com telefone', quantidade: usuarios.filter((u) => Boolean(u.phone ?? u.telefone)).length },
    ];

    return itens.map((item) => ({
        ...item,
        pct: percentual(item.quantidade, total),
    }));
}

function escaparCsv(valor) {
    return `"${String(valor ?? '').replace(/"/g, '""')}"`;
}

function exportarContas(usuarios) {
    const ordenados = [...usuarios].sort(
        (a, b) => (lerData(b.createdAt)?.getTime() ?? 0) - (lerData(a.createdAt)?.getTime() ?? 0),
    );

    const linhas = [
        ['Nome', 'E-mail', 'Tipo', 'CRM', 'Cidade', 'Cadastro', 'Perfil'],
        ...ordenados.map((usuario) => [
            usuario.name ?? usuario.nome ?? '',
            usuario.email ?? '',
            PAPEIS[papelDe(usuario)].rotulo,
            usuario.crm ?? '',
            usuario.city ?? usuario.cidade ?? '',
            formatarData(usuario.createdAt),
            perfilPreenchido(usuario).rotulo,
        ]),
    ];

    // BOM e ponto e vírgula para abrir corretamente no Excel em português.
    const csv = `\uFEFF${linhas.map((linha) => linha.map(escaparCsv).join(';')).join('\r\n')}`;
    const nomeArquivo = `ella-contas-${new Date().toISOString().slice(0, 10)}.csv`;

    try {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Compatibilidade com versões antigas do Edge/IE.
        if (window.navigator?.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, nomeArquivo);
            return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = nomeArquivo;
        link.rel = 'noopener';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Mantém o link e a URL vivos por tempo suficiente para o navegador
        // concluir o download antes da limpeza.
        window.setTimeout(() => {
            link.remove();
            URL.revokeObjectURL(url);
        }, 1500);
    } catch (error) {
        console.error('Não foi possível exportar o CSV:', error);
        window.alert('Não foi possível gerar o arquivo CSV. Tente novamente.');
    }
}

function GraficoLinhas({ meses, series }) {
    const largura = 560;
    const altura = 200;
    const esquerda = 36;
    const direita = 16;
    const base = 28;
    const maior = Math.max(1, ...series.flatMap((serie) => serie.valores));
    const topo = Math.max(4, Math.ceil(maior));
    const passos = 4;
    const ticks = Array.from({ length: passos + 1 }, (_, i) => Math.round((topo / passos) * i));
    const x = (i) => esquerda + (i * (largura - esquerda - direita)) / Math.max(1, meses.length - 1);
    const y = (v) => altura - base - (v / topo) * (altura - base - 12);
    const ultimo = meses.length - 1;

    return (
        <>
            <div className="mb-3 flex flex-wrap gap-4 text-xs text-gray-500">
                {series.map((serie) => (
                    <span key={serie.nome} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: serie.cor }} />
                        {serie.nome}
                    </span>
                ))}
            </div>

            <svg viewBox={`0 0 ${largura} ${altura}`} className="w-full" role="img"
                aria-label="Evolução do total de contas, voluntárias e psicólogas nos últimos 6 meses">
                {ticks.map((valor) => (
                    <g key={valor}>
                        <line x1={esquerda} x2={largura - direita} y1={y(valor)} y2={y(valor)} stroke="#ede9fe" strokeDasharray="3 4" />
                        <text x={esquerda - 6} y={y(valor) + 3} textAnchor="end" fontSize="9" fill="#6b7280">{valor}</text>
                    </g>
                ))}
                {meses.map((mes, i) => (
                    <text key={`${mes}-${i}`} x={x(i)} y={altura - 8} textAnchor="middle" fontSize="9" fill="#6b7280">{mes}</text>
                ))}
                {series.map((serie) => (
                    <g key={serie.nome}>
                        <polyline fill="none" stroke={serie.cor} strokeWidth={serie.largura} strokeLinejoin="round"
                            points={serie.valores.map((valor, i) => `${x(i)},${y(valor)}`).join(' ')} />
                        <circle cx={x(ultimo)} cy={y(serie.valores[ultimo])} r="3.5" fill={serie.cor} />
                    </g>
                ))}
            </svg>
        </>
    );
}

function AdminDashboard() {
    const [usuarios, setUsuarios] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [recarregar, setRecarregar] = useState(0);
    const [totalEmergencia, setTotalEmergencia] = useState(null);
    const [erroEmergencia, setErroEmergencia] = useState(false);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            setCarregando(true);
            setErro('');

            try {
                const dados = await userService.list();

                if (ativo) setUsuarios(Array.isArray(dados) ? dados : []);
            } catch (error) {
                if (ativo) {
                    setErro(error.message || 'Não foi possível carregar os dados da plataforma.');
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregar();

        return () => {
            ativo = false;
        };
    }, [recarregar]);

    // Indicador de emergência: mesma informação exibida na Home.
    useEffect(() => {
        let ativo = true;

        async function carregarEmergencia() {
            try {
                const resposta = await fetch(`${BASE_URL}/api/emergencia/acionamentos/total`);
                const dados = await resposta.json().catch(() => ({}));

                if (!resposta.ok) {
                    throw new Error(dados?.error || 'Não foi possível consultar os acionamentos.');
                }

                const total = Number(dados.total);

                if (!Number.isFinite(total)) {
                    throw new Error('Contagem inválida.');
                }

                if (ativo) {
                    setTotalEmergencia(total);
                    setErroEmergencia(false);
                }
            } catch {
                if (ativo) {
                    setErroEmergencia(true);
                }
            }
        }

        carregarEmergencia();

        const intervalo = window.setInterval(carregarEmergencia, 10000);

        return () => {
            ativo = false;
            window.clearInterval(intervalo);
        };
    }, [recarregar]);

    const lista = useMemo(() => usuarios ?? [], [usuarios]);
    const resumo = useMemo(() => calcularResumo(lista), [lista]);
    const grafico = useMemo(() => criarSeries(lista), [lista]);
    const preenchimento = useMemo(() => calcularPreenchimento(lista), [lista]);
    const recentes = useMemo(
        () =>
            [...lista]
                .sort((a, b) => (lerData(b.createdAt)?.getTime() ?? 0) - (lerData(a.createdAt)?.getTime() ?? 0))
                .slice(0, 6),
        [lista],
    );

    const distribuicao = Object.entries(PAPEIS).map(([role, config]) => {
        const quantidade = resumo.porPapel[role] ?? 0;

        return {
            role,
            ...config,
            quantidade,
            pct: percentual(quantidade, resumo.total),
        };
    });

    const papelDestaque = [...distribuicao].sort((a, b) => b.quantidade - a.quantidade)[0];
    const variacao = resumo.novas30Anteriores > 0
        ? Math.round(((resumo.novas30 - resumo.novas30Anteriores) / resumo.novas30Anteriores) * 100)
        : null;

    const estatisticas = [
        {
            icone: faUsers,
            valor: resumo.total,
            rotulo: 'Contas cadastradas',
            detalhe: `${resumo.novas30} novas nos últimos 30 dias`,
        },
        {
            icone: faHeart,
            valor: resumo.porPapel.voluntaria,
            rotulo: 'Voluntárias',
            detalhe: `${percentual(resumo.porPapel.voluntaria, resumo.total)}% das contas`,
        },
        {
            icone: faBrain,
            valor: resumo.porPapel.psicologa,
            rotulo: 'Psicólogas',
            detalhe: `${percentual(resumo.porPapel.psicologa, resumo.total)}% das contas`,
        },
        {
            icone: faUserPlus,
            valor: resumo.novas30,
            rotulo: 'Novas em 30 dias',
            detalhe: variacao === null
                ? `${resumo.novas30Anteriores} nos 30 dias anteriores`
                : `${variacao >= 0 ? '↑' : '↓'} ${Math.abs(variacao)}% em relação aos 30 anteriores`,
        },
    ];

    const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const usuarioAtual = userService.getCurrentUser();
    const nomeAdmin = usuarioAtual?.nome || usuarioAtual?.name || 'Admin';

    function atualizar() {
        setRecarregar((valor) => valor + 1);
    }

    return (
        <>
            <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm text-[#7e22ce] first-letter:uppercase">{hoje}</p>
                    <h1 className="font-serif text-4xl text-[#2e1065]">Olá, {nomeAdmin}</h1>
                    <p className="mt-1 max-w-md text-sm text-gray-600">
                        Aqui você acompanha os dados reais das contas da plataforma ELLA.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 xl:justify-end">
                    <p className="border-l-2 border-pink-400 pl-4 font-serif italic text-[#4c1d95]">
                        Juntas somos mais fortes.
                        <span className="block font-sans text-xs not-italic text-gray-600">
                            Mais apoio, mais histórias, mais recomeços.
                        </span>
                    </p>

                    <button
                        type="button"
                        onClick={atualizar}
                        disabled={carregando}
                        className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm text-[#5b21b6] transition hover:bg-violet-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={faRotate} spin={carregando} />
                        {carregando ? 'Atualizando...' : 'Atualizar'}
                    </button>
                </div>
            </header>

            {erro && (
                <div role="alert" className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span>{erro}</span>
                    <button
                        type="button"
                        onClick={atualizar}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {usuarios === null ? (
                carregando && <section className={`${card} text-sm text-gray-500`}>Carregando dados da plataforma...</section>
            ) : (
                <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
                    <div className="min-w-0 space-y-6">
                        <section aria-label="Resumo"
                            className="grid grid-cols-2 rounded-2xl border border-violet-100 bg-white xl:grid-cols-4 xl:divide-x xl:divide-violet-100">
                            {estatisticas.map((estatistica) => (
                                <div key={estatistica.rotulo} className="p-5">
                                    <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                                        <FontAwesomeIcon icon={estatistica.icone} className="text-pink-500" />
                                        {estatistica.rotulo}
                                    </p>
                                    <p className="mt-2 font-serif text-4xl tabular-nums text-[#2e1065]">
                                        {estatistica.valor.toLocaleString('pt-BR')}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">{estatistica.detalhe}</p>
                                </div>
                            ))}
                        </section>

                        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                            <section className={card}>
                                <h2 className={titulo}>Evolução das contas</h2>
                                <GraficoLinhas meses={grafico.meses} series={grafico.series} />
                            </section>

                            <section className={card}>
                                <h2 className={titulo}>Contas por tipo</h2>
                                <ul className="space-y-3">
                                    {distribuicao.map((item) => (
                                        <li key={item.role}>
                                            <div className="mb-1 flex justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.cor }} />
                                                    {item.rotulo}
                                                </span>
                                                <span className="tabular-nums text-gray-500">
                                                    {item.quantidade.toLocaleString('pt-BR')} · {item.pct}%
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-violet-50">
                                                <div className="h-2 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.cor }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-4 text-xs text-gray-500">
                                    {resumo.total > 0
                                        ? `${papelDestaque.rotulo} é o tipo mais comum (${papelDestaque.pct}% das contas).`
                                        : 'Nenhuma conta cadastrada ainda.'}
                                </p>
                            </section>
                        </div>

                        <section className={card}>
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <h2 className="font-serif text-lg text-[#2e1065]">Contas recentes</h2>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => exportarContas(lista)}
                                        disabled={lista.length === 0}
                                        className="inline-flex items-center gap-2 text-sm text-[#5b21b6] underline underline-offset-4 disabled:cursor-not-allowed disabled:text-gray-300"
                                    >
                                        <FontAwesomeIcon icon={faDownload} />
                                        Exportar CSV
                                    </button>

                                    <Link to="/contas" className="text-sm text-[#5b21b6] underline underline-offset-4">
                                        Ver todas
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead className="text-xs uppercase tracking-wide text-gray-600">
                                        <tr>
                                            <th className="py-2 font-medium">Conta</th>
                                            <th className="font-medium">E-mail</th>
                                            <th className="font-medium">Tipo</th>
                                            <th className="font-medium">CRM</th>
                                            <th className="font-medium">Cadastro</th>
                                            <th className="font-medium">Perfil</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentes.map((usuario) => {
                                            const papel = PAPEIS[papelDe(usuario)];
                                            const perfil = perfilPreenchido(usuario);

                                            return (
                                                <tr key={usuario.id} className="border-t border-violet-100 hover:bg-violet-50/50">
                                                    <td className="py-3">
                                                        <span className="flex items-center gap-2">
                                                            <Avatar
                                                                nome={usuario.name ?? usuario.nome ?? ''}
                                                                avatar={usuario.avatar}
                                                                photo={usuario.photo}
                                                                tamanho="h-8 w-8 text-xs"
                                                            />
                                                            <span className="font-medium">
                                                                {usuario.name ?? usuario.nome ?? 'Sem nome'}
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td className="text-gray-600">{usuario.email}</td>
                                                    <td>
                                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${papel.classe}`}>
                                                            {papel.rotulo}
                                                        </span>
                                                    </td>
                                                    <td className="text-xs text-gray-600">
                                                        {usuario.crm || '—'}
                                                    </td>
                                                    <td className="tabular-nums text-gray-600">
                                                        <span className="block">{formatarData(usuario.createdAt)}</span>
                                                        <span className="text-xs text-gray-600">{tempoRelativo(usuario.createdAt)}</span>
                                                    </td>
                                                    <td>
                                                        <span className="flex items-center gap-2">
                                                            <span className={`h-2 w-2 rounded-full ${perfil.classe}`} />
                                                            {perfil.rotulo}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {recentes.length === 0 && (
                                    <p className="py-4 text-sm text-gray-500">Nenhuma conta cadastrada ainda.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section className={card}>
                            <h2 className={titulo}>Ações rápidas</h2>
                            <ul className="divide-y divide-violet-100">
                                {acoesRapidas.map((acao) => (
                                    <li key={acao.texto}>
                                        <Link
                                            to={acao.to}
                                            className="flex w-full items-center gap-3 py-3 text-left text-sm hover:text-[#7e22ce]"
                                        >
                                            <FontAwesomeIcon icon={acao.icone} className="w-4 text-pink-500" />
                                            <span className="mr-auto">{acao.texto}</span>
                                            <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-300" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className={card}>
                            <h2 className={titulo}>Indicador de emergência</h2>

                            <div className="flex items-center gap-4 rounded-2xl bg-pink-50 px-4 py-4">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-pink-600">
                                    <FontAwesomeIcon icon={faBell} />
                                </span>

                                <div>
                                    <p className="font-serif text-3xl tabular-nums text-[#2e1065]">
                                        {totalEmergencia === null
                                            ? '—'
                                            : totalEmergencia.toLocaleString('pt-BR')}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-600">
                                        Acionamentos registrados
                                    </p>
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-gray-600">
                                {totalEmergencia === null
                                    ? erroEmergencia
                                        ? 'Não foi possível consultar a contagem agora.'
                                        : 'Carregando contagem...'
                                    : 'Mesmo número exibido na Home. Atualizado automaticamente.'}
                            </p>

                            <Link
                                to="/emergencia"
                                className="mt-3 inline-flex items-center gap-2 text-sm text-[#5b21b6] underline underline-offset-4"
                            >
                                Abrir página de emergência
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            </Link>
                        </section>

                        <section className={card}>
                            <h2 className={titulo}>Preenchimento dos perfis</h2>
                            <ul className="space-y-3">
                                {preenchimento.map((item) => (
                                    <li key={item.rotulo}>
                                        <div className="mb-1 flex justify-between text-sm">
                                            <span>{item.rotulo}</span>
                                            <span className="tabular-nums text-gray-500">
                                                {item.quantidade} · {item.pct}%
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-violet-50">
                                            <div className="h-2 rounded-full bg-violet-300" style={{ width: `${item.pct}%` }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-gray-500">
                                {resumo.total > 0
                                    ? `${preenchimento[0].quantidade} de ${resumo.total} contas têm foto de perfil.`
                                    : 'Cadastre uma conta para acompanhar o preenchimento dos perfis.'}
                            </p>
                        </section>

                        <section className={`${card} flex items-start gap-3 bg-pink-50 text-sm`}>
                            <FontAwesomeIcon icon={faCalendarDays} className="mt-0.5 text-pink-500" />
                            <p>
                                <span className="font-semibold text-[#2e1065]">Última atualização</span>
                                <span className="mt-1 block text-xs text-gray-600">
                                    Os números são recalculados sempre que você abre o painel ou clica em Atualizar.
                                </span>
                            </p>
                        </section>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminDashboard;
