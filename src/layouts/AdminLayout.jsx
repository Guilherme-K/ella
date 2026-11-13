import { Outlet, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse,
    faComments,
    faUsers,
    faHeart,
    faCalendarDays,
    faFileLines,
    faShieldHalved,
    faChartColumn,
    faGear,
    faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

const menu = [
    {
        nome: 'Dashboard',
        caminho: '/admin',
        icone: faHouse,
        end: true
    },
    {
        nome: 'Chats',
        caminho: '/admin/chats',
        icone: faComments
    },
    {
        nome: 'Redes de Apoio',
        caminho: '/admin/redes',
        icone: faHandHoldingHeart
    },
    {
        nome: 'Contas',
        caminho: '/admin/contas',
        icone: faUsers
    }
];

const menuEmDesenvolvimento = [
    { nome: 'Voluntárias', icone: faHeart },
    { nome: 'Eventos', icone: faCalendarDays },
    { nome: 'Conteúdos', icone: faFileLines },
    { nome: 'Denúncias', icone: faShieldHalved },
    { nome: 'Relatórios', icone: faChartColumn },
    { nome: 'Configurações', icone: faGear }
];

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header variant="admin" />

            <div className="flex flex-1 bg-[#f5f0ff]">
                <aside className="w-20 shrink-0 bg-gradient-to-b from-violet-950 to-purple-900 py-6 text-white md:w-64">
                    <div className="mb-8 hidden px-6 md:block">
                        <h2 className="text-xl font-bold">
                            Painel Admin
                        </h2>
                        <p className="mt-1 text-sm text-violet-200">
                            Gerenciamento ELLA
                        </p>
                    </div>

                    <nav className="flex flex-col gap-2 px-2 md:px-4">
                        {menu.map((item) => (
                            <NavLink
                                key={item.nome}
                                to={item.caminho}
                                end={item.end}
                                title={item.nome}
                                className={({ isActive }) =>
                                    `flex items-center justify-center gap-3 rounded-xl px-3 py-3 transition-colors md:justify-start ${
                                        isActive
                                            ? 'bg-white text-violet-900 shadow-md'
                                            : 'text-violet-100 hover:bg-white/10'
                                    }`
                                }
                            >
                                <FontAwesomeIcon
                                    icon={item.icone}
                                    className="text-lg"
                                />

                                <span className="hidden text-sm font-semibold md:block">
                                    {item.nome}
                                </span>
                            </NavLink>
                        ))}

                        <div className="my-3 border-t border-white/20" />

                        {menuEmDesenvolvimento.map((item) => (
                            <div
                                key={item.nome}
                                title={`${item.nome} - Em desenvolvimento`}
                                className="flex cursor-not-allowed items-center justify-center gap-3 rounded-xl px-3 py-3 text-violet-300 opacity-60 md:justify-start"
                                aria-disabled="true"
                            >
                                <FontAwesomeIcon
                                    icon={item.icone}
                                    className="text-lg"
                                />

                                <span className="hidden text-sm md:block">
                                    {item.nome}
                                </span>
                            </div>
                        ))}
                    </nav>
                </aside>

                <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-8">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
}