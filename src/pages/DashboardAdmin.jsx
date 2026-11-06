import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowDown, faArrowLeft, faArrowUp, faBell, faCalendarDays, faChartColumn,
    faChevronDown, faChevronRight, faFileLines, faGear, faHeart, faHouse,
    faMagnifyingGlass, faRightFromBracket, faShieldHalved, faUser, faUserPlus, faUsers,
    faPen, faTrash, faArrowRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import imagemMulheres from '../assets/mulheres2.png';
import Footer from '../components/Footer';
import Avatar from './Avatar';
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
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(() => userService.getCurrentUser());
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'usuarias'
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    // Carregar usuárias do banco de dados MySQL
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

    // Verificação de autenticação e papel de administrador
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin =
        currentUser?.tipo === 'admin' ||
        currentUser?.role === 'admin' ||
        currentUser?.email?.toLowerCase().includes('admin');

    if (!isAdmin) {
        return (
            <main className="min-h-screen flex-1 bg-purple-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-purple-100">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 mb-4">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-xl" />
                    </span>
                    <h1 className="font-serif text-2xl font-bold text-violet-950">Acesso Restrito</h1>
                    <p className="mt-2 text-xs text-violet-500">
                        Esta página é exclusiva para administradores da plataforma ELLA.
                    </p>
                    <div className="mt-6 flex flex-col gap-2">
                        <Link
                            to="/contas"
                            className="w-full rounded-xl bg-pink-400 py-2.5 text-xs font-semibold text-white hover:bg-pink-500 transition"
                        >
                            Ir para Minhas Contas
                        </Link>
                        <Link
                            to="/"
                            className="w-full rounded-xl border border-purple-200 py-2.5 text-xs font-medium text-violet-700 hover:bg-purple-50 transition"
                        >
                            Voltar ao Início
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    function handleLogout() {
        userService.clearSession();
        navigate('/login');
    }

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

    const menu = [
        { id: 'dashboard', nome: 'Dashboard', icone: faHouse },
        { id: 'usuarias', nome: 'Usuárias (Contas)', icone: faUsers },
        { id: 'voluntarias', nome: 'Voluntárias', icone: faHeart },
        { id: 'eventos', nome: 'Eventos', icone: faCalendarDays },
        { id: 'conteudos', nome: 'Conteúdos', icone: faFileLines },
        { id: 'denuncias', nome: 'Denúncias', icone: faShieldHalved },
        { id: 'relatorios', nome: 'Relatórios', icone: faChartColumn },
        { id: 'configuracoes', nome: 'Configurações', icone: faGear },
    ];

    const estatisticas = [
        { icone: faUsers, valor: String(users.length || '12'), rotulo: 'Usuárias cadastradas', variacao: '+12% este mês', sobe: true },
        { icone: faHeart, valor: '342', rotulo: 'Voluntárias ativas', variacao: '+8% este mês', sobe: true },
        { icone: faCalendarDays, valor: '86', rotulo: 'Eventos realizados', variacao: '+20% este mês', sobe: true },
        { icone: faShieldHalved, valor: '23', rotulo: 'Denúncias recebidas', variacao: '-15% este mês', sobe: false },
    ];

    const acoesRapidas = [
        { texto: 'Gerenciar contas cadastradas', icone: faUsers, onClick: () => setActiveTab('usuarias') },
        { texto: 'Adicionar nova usuária', icone: faUserPlus, to: '/cadastro' },
        { texto: 'Criar evento', icone: faCalendarDays },
        { texto: 'Publicar conteúdo', icone: faFileLines },
        { texto: 'Ver denúncias', icone: faShieldHalved, to: '/denuncia' },
    ];

    const atividades = [
        { icone: faUser, titulo: 'Nova conta registrada no banco', detalhe: users[users.length - 1]?.name || 'Usuária recente', tempo: 'Hoje' },
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

    return (
        <div className="flex min-h-screen flex-col bg-[#f5f0ff] text-[#2e1065]">
            <header className="flex items-center gap-4 bg-white px-4 py-2 shadow-sm">
                <Link to="/" aria-label="Voltar ao início" className="text-violet-700 hover:text-pink-600 transition">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <Link to="/" className="flex items-center gap-2">
                    <img src="/Logo.png" alt="ELLA" className="h-10" />
                    <span className="hidden font-serif font-bold text-xl text-pink-500 sm:block">ELLA</span>
                </Link>

                <div className="relative mx-auto hidden w-full max-w-xl md:block">
                    <FontAwesomeIcon icon={faMagnifyingGlass}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7e22ce]" />
                    <input
                        type="search"
                        placeholder="Buscar usuária, voluntária ou evento..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="w-full rounded-lg bg-[#f3e8ff] py-2 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-pink-300"
                    />
                </div>

                <div className="ml-auto flex items-center gap-5">
                    <button type="button" aria-label="Notificações" className="relative text-[#4c1d95]">
                        <FontAwesomeIcon icon={faBell} />
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-pink-500" />
                    </button>

                    {/* Perfil do Administrador no Header */}
                    <div
                        onClick={() => {
                            setEditingUser(currentUser);
                            setProfileModalOpen(true);
                        }}
                        className="flex items-center gap-2 cursor-pointer rounded-full p-1 hover:bg-purple-50 transition"
                        title="Clique para editar seu perfil e senha"
                    >
                        <Avatar
                            nome={currentUser.nome || currentUser.name || 'Admin'}
                            avatar={currentUser.avatar}
                            tamanho="h-9 w-9"
                        />
                        <div className="hidden leading-tight sm:block">
                            <p className="text-sm font-semibold">{currentUser.nome || currentUser.name || 'Admin ELLA'}</p>
                            <p className="text-xs text-gray-500">Administradora</p>
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} className="text-xs text-violet-400" />
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Barra lateral */}
                <aside className="relative hidden w-64 shrink-0 overflow-hidden bg-gradient-to-b from-[#3b1a6e] to-[#2e0a63] lg:block">
                    <nav className="relative z-10 space-y-1 p-3">
                        {menu.map((item) => {
                            const isSelected = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        if (item.id === 'dashboard' || item.id === 'usuarias') {
                                            setActiveTab(item.id);
                                        }
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white transition ${
                                        isSelected ? 'bg-[#7e3fc9] font-semibold shadow-sm' : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={item.icone} className="w-4" />
                                    <span>{item.nome}</span>
                                    {item.id === 'usuarias' && (
                                        <span className="ml-auto rounded-full bg-pink-400/80 px-2 py-0.5 text-[10px] font-bold text-white">
                                            {users.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                        <hr className="my-3 border-white/20" />
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-pink-300 hover:bg-white/10 transition"
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                            Sair do Painel
                        </button>
                    </nav>
                    <img src={imagemMulheres} alt=""
                        className="pointer-events-none absolute bottom-0 left-0 h-72 w-full object-cover object-left-top opacity-50" />
                </aside>

                {/* Conteúdo Principal */}
                <main className="min-w-0 flex-1 p-6">
                    {/* Botões para alternar abas no mobile */}
                    <div className="flex lg:hidden gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
                                activeTab === 'dashboard' ? 'bg-[#7e3fc9] text-white' : 'bg-white text-violet-700'
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('usuarias')}
                            className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
                                activeTab === 'usuarias' ? 'bg-[#7e3fc9] text-white' : 'bg-white text-violet-700'
                            }`}
                        >
                            Contas ({users.length})
                        </button>
                    </div>

                    {/* ABA: CONTAS CADASTRADAS (USUÁRIAS) */}
                    {activeTab === 'usuarias' ? (
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold font-serif text-violet-950">
                                        Gestão de Contas Cadastradas
                                    </h1>
                                    <p className="text-xs text-violet-500 mt-1">
                                        Usuárias registradas no banco de dados MySQL da plataforma ELLA
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={carregarUsuarios}
                                        title="Atualizar lista"
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-200 text-violet-700 hover:bg-purple-50 transition"
                                    >
                                        <FontAwesomeIcon icon={faArrowRotateRight} className={loadingUsers ? 'animate-spin' : ''} />
                                    </button>
                                    <Link
                                        to="/cadastro"
                                        className="flex items-center gap-2 rounded-xl bg-pink-400 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-pink-500 transition"
                                    >
                                        <FontAwesomeIcon icon={faUserPlus} />
                                        Cadastrar Nova Conta
                                    </Link>
                                </div>
                            </div>

                            {/* Barra de busca de contas */}
                            <div className="rounded-xl bg-white p-4 shadow-sm flex items-center gap-3">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-violet-400" />
                                <input
                                    type="text"
                                    placeholder="Filtrar usuárias por nome ou e-mail..."
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    className="w-full text-xs text-violet-900 outline-none placeholder:text-violet-300"
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

                            {/* Tabela de Usuárias do Banco */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm overflow-hidden">
                                {loadingUsers && users.length === 0 && (
                                    <div className="py-12 text-center text-sm text-violet-400">
                                        <FontAwesomeIcon icon={faArrowRotateRight} className="animate-spin mr-2" />
                                        Carregando contas cadastradas...
                                    </div>
                                )}

                                {usersError && (
                                    <div className="my-4 rounded-xl bg-pink-50 border border-pink-200 p-4 text-xs text-pink-700">
                                        {usersError}
                                    </div>
                                )}

                                {!loadingUsers && filteredUsers.length === 0 && (
                                    <p className="py-10 text-center text-sm text-violet-400">
                                        {searchFilter ? 'Nenhum usuário corresponde à busca.' : 'Nenhuma conta cadastrada.'}
                                    </p>
                                )}

                                {!loadingUsers && filteredUsers.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[650px] text-left text-sm">
                                            <thead className="text-xs text-gray-500 border-b border-purple-100">
                                                <tr>
                                                    <th className="py-3 pl-2">Usuária</th>
                                                    <th>E-mail</th>
                                                    <th>Perfil / Papel</th>
                                                    <th>ID</th>
                                                    <th className="text-right pr-2">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-purple-50">
                                                {filteredUsers.map((u) => {
                                                    const isUserAdmin = u.tipo === 'admin' || u.email?.toLowerCase().includes('admin');
                                                    const isMe = Number(currentUser.id) === Number(u.id);
                                                    const displayName = u.name ?? u.nome ?? 'Sem nome';

                                                    return (
                                                        <tr key={u.id} className="hover:bg-purple-50/50 transition">
                                                            <td className="py-3 pl-2">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar
                                                                        nome={displayName}
                                                                        avatar={u.avatar}
                                                                        tamanho="h-9 w-9"
                                                                    />
                                                                    <div>
                                                                        <p className="font-semibold text-xs text-violet-950 flex items-center gap-1.5">
                                                                            {displayName}
                                                                            {isMe && (
                                                                                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-bold text-pink-600">
                                                                                    Você
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-xs text-violet-600">{u.email}</td>
                                                            <td>
                                                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                                                    isUserAdmin ? 'bg-violet-100 text-violet-800' : 'bg-pink-100 text-pink-700'
                                                                }`}>
                                                                    {isUserAdmin ? 'Administradora' : 'Usuária'}
                                                                </span>
                                                            </td>
                                                            <td className="text-xs font-mono text-violet-400">#{u.id}</td>
                                                            <td className="text-right pr-2">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setEditingUser(u);
                                                                            setProfileModalOpen(true);
                                                                        }}
                                                                        className="flex items-center gap-1 rounded-lg border border-purple-200 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-purple-100 transition"
                                                                        title="Editar nome, foto ou senha"
                                                                    >
                                                                        <FontAwesomeIcon icon={faPen} className="text-[10px] text-pink-400" />
                                                                        Editar
                                                                    </button>

                                                                    {!isMe && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDeleteUser(u)}
                                                                            className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                                                                            title="Excluir usuário"
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
                            </div>
                        </div>
                    ) : (
                        /* ABA: DASHBOARD OVERVIEW */
                        <div>
                            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold">Olá, {currentUser.nome || currentUser.name || 'Admin'}!</h1>
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

                                        <section className={`${card} flex flex-col`}>
                                            <h2 className="mb-4 font-bold">Tipos de violência</h2>
                                            <div className="flex flex-1 items-center justify-around gap-4">
                                                <GraficoRosca />
                                                <ul className="space-y-1 text-xs">
                                                    {violencia.map((v) => (
                                                        <li key={v.nome} className="flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: v.cor }} />
                                                            <span>{v.nome}</span>
                                                            <strong className="ml-auto">{v.pct}%</strong>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Seção Solicitações com link direto para contas */}
                                    <section className={card}>
                                        <div className="mb-3 flex items-center justify-between">
                                            <h2 className="font-bold">Últimas solicitações</h2>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('usuarias')}
                                                className="text-sm font-semibold text-[#5b21b6] hover:underline"
                                            >
                                                Ver contas cadastradas ({users.length})
                                            </button>
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
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setActiveTab('usuarias')}
                                                                    className="rounded-md bg-[#5b21b6] px-4 py-1 text-xs font-semibold text-white hover:bg-violet-800 transition"
                                                                >
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
                                                    {a.to ? (
                                                        <Link
                                                            to={a.to}
                                                            className="flex w-full items-center gap-3 rounded-lg bg-pink-50 px-3 py-3 text-left text-sm hover:bg-pink-100 transition"
                                                        >
                                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                                                <FontAwesomeIcon icon={a.icone} />
                                                            </span>
                                                            <span className="mr-auto">{a.texto}</span>
                                                            <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-400" />
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={a.onClick}
                                                            className="flex w-full items-center gap-3 rounded-lg bg-pink-50 px-3 py-3 text-left text-sm hover:bg-pink-100 transition"
                                                        >
                                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                                                <FontAwesomeIcon icon={a.icone} />
                                                            </span>
                                                            <span className="mr-auto">{a.texto}</span>
                                                            <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-400" />
                                                        </button>
                                                    )}
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
                        </div>
                    )}
                </main>
            </div>

            <Footer />

            {/* Modal de Edição de Usuário / Administrador */}
            {editingUser && (
                <ProfileModal
                    isOpen={profileModalOpen}
                    onClose={() => {
                        setProfileModalOpen(false);
                        setEditingUser(null);
                    }}
                    user={editingUser}
                    onUpdateUser={(updated) => {
                        if (Number(currentUser.id) === Number(updated.id)) {
                            setCurrentUser(updated);
                        }
                        carregarUsuarios();
                    }}
                    onLogout={Number(currentUser.id) === Number(editingUser.id) ? handleLogout : undefined}
                />
            )}
        </div>
    );
}

export default AdminDashboard;
