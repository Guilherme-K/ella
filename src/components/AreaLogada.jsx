import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faBell, faCalendarDays, faChartColumn, faChevronDown, faCommentDots,
    faFileLines, faGear, faHouse, faMagnifyingGlass, faRightFromBracket, faShieldHalved, faUsers,
} from '@fortawesome/free-solid-svg-icons';
import imagemMulheres from '../assets/mulheres2.png';
import Avatar from './Avatar';
import Footer from './Footer';
 
const menu = [
    { nome: 'Início', icone: faHouse, to: '/' },
    { nome: 'Chats', icone: faCommentDots, to: '/chats' },
    { nome: 'Usuárias', icone: faUsers },
    { nome: 'Eventos', icone: faCalendarDays },
    { nome: 'Conteúdos', icone: faFileLines },
    { nome: 'Denúncias', icone: faShieldHalved },
    { nome: 'Relatórios', icone: faChartColumn },
    { nome: 'Configurações', icone: faGear, to: '/minha-conta' },
];
 
function AreaLogada({ ativo, usuario, children }) {
    const navigate = useNavigate();
    const classeItem = (nome) =>
        `flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white ${
            nome === ativo ? 'bg-[#7e3fc9]' : 'hover:bg-white/10'
        }`;
 
    return (
        <div className="flex min-h-screen flex-col bg-[#f5f0ff] text-[#2e1065]">
            <header className="flex items-center gap-4 bg-white px-4 py-2 shadow-sm">
                <button type="button" aria-label="Voltar" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <img src="/Logo.png" alt="ELLA" className="h-12" />
                <span className="hidden text-2xl text-pink-500 sm:block">ELLA</span>
 
                <div className="relative mx-auto hidden w-full max-w-xl md:block">
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7e22ce]"
                    />
                    <input
                        type="search"
                        placeholder="Buscar usuária, assunto ou número de protocolo..."
                        className="w-full rounded-lg bg-[#f3e8ff] py-2 pl-9 pr-4 text-sm"
                    />
                </div>
 
                <div className="ml-auto flex items-center gap-5">
                    <button type="button" aria-label="Notificações" className="relative text-[#4c1d95]">
                        <FontAwesomeIcon icon={faBell} />
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-pink-500" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Avatar nome={usuario.nome} avatar={usuario.avatar} tamanho="h-9 w-9" />
                        <div className="hidden leading-tight sm:block">
                            <p className="text-sm font-semibold">{usuario.nome}</p>
                            <p className="text-xs text-gray-500">{usuario.papel}</p>
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                    </div>
                </div>
            </header>
 
            <div className="flex flex-1">
                <aside className="relative hidden w-60 shrink-0 overflow-hidden bg-gradient-to-b from-[#3b1a6e] to-[#2e0a63] lg:block">
                    <nav className="relative z-10 space-y-1 p-3">
                        {menu.map((item) =>
                            item.to ? (
                                <Link key={item.nome} to={item.to} className={classeItem(item.nome)}>
                                    <FontAwesomeIcon icon={item.icone} className="w-4" />
                                    {item.nome}
                                </Link>
                            ) : (
                                <button key={item.nome} type="button" className={classeItem(item.nome)}>
                                    <FontAwesomeIcon icon={item.icone} className="w-4" />
                                    {item.nome}
                                </button>
                            )
                        )}
                        <hr className="my-3 border-white/20" />
                        
                        <button type="button" className={classeItem('Sair')}>
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                            Sair
                        </button>
                    </nav>
                    <img
                        src={imagemMulheres}
                        alt=""
                        className="pointer-events-none absolute bottom-0 left-0 h-72 w-full object-cover object-left-top"
                    />
                </aside>
 
                <main className="min-w-0 flex-1 p-6">{children}</main>
            </div>
 
            <Footer />
        </div>
    );
}
 
export default AreaLogada;
