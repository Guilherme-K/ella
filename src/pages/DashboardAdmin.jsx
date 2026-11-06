import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowDown,
    faArrowUp,
    faCalendarDays,
    faChevronRight,
    faFileLines,
    faHeart,
    faShieldHalved,
    faUser,
    faUserPlus,
    faUsers,
    faPen,
    faTrash,
    faArrowRotateRight,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import Avatar from '../components/Avatar';
import ProfileModal from '../components/ProfileModal';
import { userService } from '../services/userService';

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

const card = 'rounded-xl bg-white p-5 shadow-sm';

function GraficoLinhas() {
    const largura = 560;
    const altura = 200;
    const esquerda = 40;
    const base = 30;

    const x = (i) => esquerda + (i * (largura - esquerda - 10)) / (meses.length - 1);
    const y = (v) => altura - base - (v / 1500) * (altura - base - 10);

    return (
        <svg
            viewBox={`0 0 ${largura} ${altura}`}
            className="w-full"
            role="img"
            aria-label="Crescimento de usuárias, voluntárias e eventos nos últimos 6 meses"
        >
            {[0, 300, 600, 900, 1200, 1500].map((v) => (
                <g key={v}>
                    <line
                        x1={esquerda}
                        x2={largura - 10}
                        y1={y(v)}
                        y2={y(v)}
                        stroke="#ede9fe"
                    />
                    <text
                        x={esquerda - 6}
                        y={y(v) + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="#6b7280"
                    >
                        {v}
                    </text>
                </g>
            ))}

            {meses.map((m, i) => (
                <text
                    key={m}
                    x={x(i)}
                    y={altura - 10}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#6b7280"
                >
                    {m}
                </text>
            ))}

            {series.map((s) => (
                <g key={s.nome}>
                    <polyline
                        fill="none"
                        stroke={s.cor}
                        strokeWidth="2"
                        points={s.valores.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
                    />
                    {s.valores.map((v, i) => (
                        <circle
                            key={i}
                            cx={x(i)}
                            cy={y(v)}
                            r="3"
                            fill={s.cor}
                        />
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
        <svg
            viewBox="0 0 100 100"
            className="h-36 w-36 shrink-0"
            role="img"
            aria-label="Distribuição dos tipos de violência registrados"
        >
            <g transform="rotate(-90 50 50)">
                {violencia.map((v, i) => {
                    const tamanho = (v.pct / 100) * circunferencia;
                    return (
                        <circle
                            key={v.nome}
                            cx="50"
                            cy="50"
                            r={raio}
                            fill="none"
                            stroke={v.cor}
                            strokeWidth="14"
                            strokeDasharray={`${tamanho} ${circunferencia - tamanho}`}
                            strokeDashoffset={-(inicios[i] / 100) * circunferencia}
                        />
                    );
                })}
            </g>
            <text
                x="50"
                y="50"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#3b1a6e"
            >
                {violencia[0].pct}%
            </text>
            <text
                x="50"
                y="60"
                textAnchor="middle"
                fontSize="5"
                fill="#6b7280"
            >
                Total de registros
            </text>
        </svg>
    );
}

export default function DashboardAdmin() {
    const [currentUser, setCurrentUser] = useState(() => userService.getCurrentUser());
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    function carregarUsuarios() {
        setLoadingUsers(true);
        userService.list()
            .then((dados) => {
                setUsers(Array.isArray(dados) ? dados : []);
                setUsersError('');
            })
            .catch((err) => {
                setUsersError(err.message || 'Erro ao carregar usuárias.');
            })
            .finally(() => {
                setLoadingUsers(false);
            });
    }

    useEffect(() => {
        let ignore = false;

        userService.list()
            .then((dados) => {
                if (!ignore) {
                    setUsers(Array.isArray(dados) ? dados : []);
                    setUsersError('');
                    setLoadingUsers(false);
                }
            })
            .catch((err) => {
                if (!ignore) {
                    setUsersError(err.message || 'Erro ao carregar usuárias.');
                    setLoadingUsers(false);
                }
            });

        function handleSync() {
            if (!ignore) {
                setCurrentUser(userService.getCurrentUser());
                userService.list()
                    .then((dados) => {
                        if (!ignore) {
                            setUsers(Array.isArray(dados) ? dados : []);
                        }
                    })
                    .catch(() => {});
            }
        }

        window.addEventListener('auth-change', handleSync);
        window.addEventListener('storage', handleSync);

        return () => {
            ignore = true;
            window.removeEventListener('auth-change', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, []);

    async function handleDeleteUser(userToDelete) {
        const confirmDelete = window.confirm(
            `Tem certeza que deseja excluir o usuário "${userToDelete.name || userToDelete.email}"? Esta ação removerá a conta do banco MySQL.`
        );
        if (!confirmDelete) return;

        try {
            await userService.remove(userToDelete.id);
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        } catch (err) {
            alert(err.message || 'Erro ao excluir usuário.');
        }
    }

    const filteredUsers = users.filter((u) => {
        const name = (u.name || u.nome || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const query = searchFilter.toLowerCase();
        return name.includes(query) || email.includes(query);
    });

    const estatisticas = [
        { icone: faUsers, valor: String(users.length || '12'), rotulo: 'Usuárias cadastradas', variacao: '+12% este mês', sobe: true },
        { icone: faHeart, valor: '342', rotulo: 'Voluntárias ativas', variacao: '+8% este mês', sobe: true },
        { icone: faCalendarDays, valor: '86', rotulo: 'Eventos realizados', variacao: '+20% este mês', sobe: true },
        { icone: faShieldHalved, valor: '23', rotulo: 'Denúncias recebidas', variacao: '-15% este mês', sobe: false },
    ];

    const acoesRapidas = [
        { texto: 'Cadastrar nova conta', icone: faUserPlus, to: '/cadastro' },
        { texto: 'Cadastrar voluntária', icone: faHeart, to: '/voluntaria' },
        { texto: 'Ver denúncias', icone: faShieldHalved, to: '/denuncia' },
        { texto: 'Central de informações', icone: faFileLines, to: '/informacoes' },
    ];

    const atividades = [
        {
            icone: faUser,
            titulo: 'Nova usuária no MySQL',
            detalhe: users[users.length - 1]?.name || 'Usuária recente',
            tempo: 'Hoje'
        },
        {
            icone: faHeart,
            titulo: 'Voluntária se inscreveu',
            detalhe: 'Ana Costa',
            tempo: 'Há 12 minutos'
        },
        {
            icone: faCalendarDays,
            titulo: 'Evento publicado',
            detalhe: 'Roda de Conversa - Autocuidado',
            tempo: 'Há 1 hora'
        },
        {
            icone: faShieldHalved,
            titulo: 'Nova denúncia recebida',
            detalhe: 'Relato de violência psicológica',
            tempo: 'Há 2 horas'
        },
        {
            icone: faFileLines,
            titulo: 'Conteúdo publicado',
            detalhe: 'Dicas de segurança',
            tempo: 'Há 3 horas'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-violet-950 font-serif">
                        Olá, {currentUser?.nome || currentUser?.name || 'Admin'}!
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Aqui você acompanha o que acontece na plataforma ELLA.
                        <br />
                        Gerencie usuárias no banco MySQL, voluntárias, eventos e muito mais.
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl bg-pink-100 px-5 py-4 xl:w-[28rem]">
                    <div className="mr-auto">
                        <p className="font-semibold text-violet-950">Juntas somos mais fortes.</p>
                        <p className="text-xs text-violet-600">
                            Mais apoio, mais histórias, mais recomeços.
                        </p>
                    </div>

                    <FontAwesomeIcon
                        icon={faHeart}
                        className="text-pink-500 text-xl"
                    />
                </div>
            </div>

            {/* Grid Principal */}
            <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
                <div className="min-w-0 space-y-6">
                    {/* Estatísticas */}
                    <section
                        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                        aria-label="Resumo"
                    >
                        {estatisticas.map((e) => (
                            <div key={e.rotulo} className={card}>
                                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                    <FontAwesomeIcon icon={e.icone} />
                                </span>
                                <p className="text-3xl font-bold">{e.valor}</p>
                                <p className="text-sm text-gray-600">{e.rotulo}</p>
                                <p className="mt-3 text-xs font-semibold text-emerald-600">
                                    <FontAwesomeIcon
                                        icon={e.sobe ? faArrowUp : faArrowDown}
                                        className="mr-1"
                                    />
                                    {e.variacao}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* Gráficos */}
                    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                        <section className={card}>
                            <h2 className="mb-2 font-bold text-violet-950">
                                Crescimento da plataforma
                            </h2>

                            <ul className="mb-2 flex flex-wrap gap-4 text-xs">
                                {series.map((s) => (
                                    <li
                                        key={s.nome}
                                        className="flex items-center gap-1"
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: s.cor }}
                                        />
                                        {s.nome}
                                    </li>
                                ))}
                            </ul>

                            <GraficoLinhas />
                        </section>

                        <section className={`${card} flex flex-col`}>
                            <h2 className="mb-4 font-bold text-violet-950">
                                Tipos de violência
                            </h2>

                            <div className="flex flex-1 items-center justify-around gap-4">
                                <GraficoRosca />

                                <ul className="space-y-1 text-xs">
                                    {violencia.map((v) => (
                                        <li
                                            key={v.nome}
                                            className="flex items-center gap-2"
                                        >
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: v.cor }}
                                            />
                                            <span>{v.nome}</span>
                                            <strong className="ml-auto">{v.pct}%</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Seção Contas Cadastradas (Integrada no Dashboard) */}
                    <section className={card}>
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-purple-50 pb-3">
                            <div>
                                <h2 className="font-bold text-lg text-violet-950">
                                    Contas Cadastradas no MySQL ({users.length})
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Usuárias e administradoras registradas no banco de dados da plataforma ELLA
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={carregarUsuarios}
                                    title="Recarregar do banco"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200 text-violet-700 hover:bg-purple-50 transition"
                                >
                                    <FontAwesomeIcon icon={faArrowRotateRight} className={loadingUsers ? 'animate-spin' : ''} />
                                </button>
                                <Link
                                    to="/cadastro"
                                    className="flex items-center gap-1.5 rounded-lg bg-pink-400 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-pink-500 transition"
                                >
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    Adicionar Conta
                                </Link>
                            </div>
                        </div>

                        {/* Filtro de Usuárias */}
                        <div className="mb-4 flex items-center gap-2 rounded-xl bg-purple-50/60 px-3 py-2 text-xs">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-violet-400" />
                            <input
                                type="text"
                                placeholder="Filtrar usuárias por nome ou e-mail..."
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="w-full bg-transparent text-xs text-violet-900 outline-none placeholder:text-violet-300"
                            />
                            {searchFilter && (
                                <button
                                    type="button"
                                    onClick={() => setSearchFilter('')}
                                    className="text-xs text-pink-500 hover:underline"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>

                        {/* Tabela de Contas */}
                        {loadingUsers && users.length === 0 && (
                            <div className="py-8 text-center text-sm text-violet-400">
                                <FontAwesomeIcon icon={faArrowRotateRight} className="animate-spin mr-2" />
                                Carregando usuárias do banco de dados...
                            </div>
                        )}

                        {usersError && (
                            <div className="my-2 rounded-xl bg-pink-50 border border-pink-200 p-3 text-xs text-pink-700">
                                {usersError}
                            </div>
                        )}

                        {!loadingUsers && filteredUsers.length === 0 && (
                            <p className="py-8 text-center text-sm text-violet-400">
                                {searchFilter ? 'Nenhum usuário corresponde à busca.' : 'Nenhuma conta cadastrada.'}
                            </p>
                        )}

                        {!loadingUsers && filteredUsers.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-left text-sm">
                                    <thead className="text-xs text-gray-500 border-b border-purple-100">
                                        <tr>
                                            <th className="py-2.5 pl-2">Usuária</th>
                                            <th>E-mail</th>
                                            <th>Papel</th>
                                            <th>ID</th>
                                            <th className="text-right pr-2">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-50">
                                        {filteredUsers.map((u) => {
                                            const isUserAdmin = u.tipo === 'admin' || u.email?.toLowerCase().includes('admin');
                                            const isMe = Number(currentUser?.id) === Number(u.id);
                                            const displayName = u.name ?? u.nome ?? 'Sem nome';

                                            return (
                                                <tr key={u.id} className="hover:bg-purple-50/50 transition">
                                                    <td className="py-2.5 pl-2">
                                                        <div className="flex items-center gap-2.5">
                                                            <Avatar
                                                                nome={displayName}
                                                                avatar={u.avatar}
                                                                tamanho="h-8 w-8"
                                                            />
                                                            <p className="font-semibold text-xs text-violet-950 flex items-center gap-1.5">
                                                                {displayName}
                                                                {isMe && (
                                                                    <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-bold text-pink-600">
                                                                        Você
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="text-xs text-violet-600">{u.email}</td>
                                                    <td>
                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                            isUserAdmin ? 'bg-violet-100 text-violet-800' : 'bg-pink-100 text-pink-700'
                                                        }`}>
                                                            {isUserAdmin ? 'Administradora' : 'Usuária'}
                                                        </span>
                                                    </td>
                                                    <td className="text-xs font-mono text-violet-400">#{u.id}</td>
                                                    <td className="text-right pr-2">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingUser(u);
                                                                    setProfileModalOpen(true);
                                                                }}
                                                                className="flex items-center gap-1 rounded-lg border border-purple-200 px-2 py-1 text-xs font-medium text-violet-700 hover:bg-purple-100 transition"
                                                                title="Editar dados ou senha"
                                                            >
                                                                <FontAwesomeIcon icon={faPen} className="text-[10px] text-pink-400" />
                                                                Editar
                                                            </button>

                                                            {!isMe && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteUser(u)}
                                                                    className="flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                                                                    title="Excluir do banco"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                                                                    Excluir
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>

                {/* Coluna Lateral */}
                <div className="space-y-6">
                    <section className={card}>
                        <h2 className="mb-3 font-bold text-violet-950">Ações rápidas</h2>
                        <ul className="space-y-2">
                            {acoesRapidas.map((a) => (
                                <li key={a.texto}>
                                    <Link
                                        to={a.to}
                                        className="flex w-full items-center gap-3 rounded-lg bg-pink-50 px-3 py-3 text-left text-sm hover:bg-pink-100 transition"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                            <FontAwesomeIcon icon={a.icone} />
                                        </span>
                                        <span className="mr-auto font-medium text-violet-900">{a.texto}</span>
                                        <FontAwesomeIcon
                                            icon={faChevronRight}
                                            className="text-xs text-gray-400"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className={card}>
                        <h2 className="mb-3 font-bold text-violet-950">Atividade recente</h2>
                        <ul className="space-y-4">
                            {atividades.map((a) => (
                                <li key={a.titulo} className="flex items-start gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                        <FontAwesomeIcon icon={a.icone} />
                                    </span>
                                    <div className="mr-auto">
                                        <p className="text-sm font-semibold text-violet-950">{a.titulo}</p>
                                        <p className="text-xs text-gray-500">{a.detalhe}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{a.tempo}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            {/* Modal para Edição de Usuárias / Senha */}
            {editingUser && (
                <ProfileModal
                    isOpen={profileModalOpen}
                    onClose={() => {
                        setProfileModalOpen(false);
                        setEditingUser(null);
                    }}
                    user={editingUser}
                    onUpdateUser={(updated) => {
                        if (Number(currentUser?.id) === Number(updated.id)) {
                            setCurrentUser(updated);
                        }
                        carregarUsuarios();
                    }}
                />
            )}
        </div>
    );
}
