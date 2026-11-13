import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBan, faBrain, faCalendarDays, faCheckDouble, faCircleCheck, faClockRotateLeft,
    faEllipsisVertical, faFaceSmile, faFileLines, faHeart, faPaperclip, faPaperPlane,
    faPhone, faShieldHalved, faTriangleExclamation, faUser, faVideo,
} from '@fortawesome/free-solid-svg-icons';
import Avatar from '../components/Avatar';
import SavedChatMessage from '../components/SavedChatMessage';
import { useChatMessages } from '../hooks/useChatMessages';

const usuario = { nome: 'Mariana Costa', papel: 'Voluntária' };

const conversas = [
    { id: 1, nome: 'Juliana Ferreira', previa: 'Eu não sei mais o que fazer...', hora: '10:24', tag: 'Urgente' },
    { id: 2, nome: 'Carla Menezes', previa: 'Obrigada por me ouvir. Isso já...', hora: '09:32', tag: 'Apoio emocional' },
    { id: 3, nome: 'Renata Souza', previa: 'Gostaria de tirar uma dúvida...', hora: '08:47', tag: 'Orientação jurídica' },
    { id: 4, nome: 'Beatriz Lima', previa: 'É possível conversar com uma...', hora: 'Ontem', tag: 'Apoio emocional' },
    { id: 5, nome: 'Fernanda Alves', previa: 'Preciso de ajuda urgente...', hora: 'Ontem', tag: 'Urgente' },
    { id: 6, nome: 'Tais Oliveira', previa: 'Queria saber se vocês indicam...', hora: 'Sáb', tag: 'Orientação jurídica' },
    { id: 7, nome: 'Larissa Santos', previa: 'Muito obrigada pela ajuda!', hora: 'Sáb', tag: 'Apoio emocional' },
    { id: 8, nome: 'Camila Rodrigues', previa: 'Estou passando por uma situação...', hora: 'Sex', tag: 'Apoio emocional' },
    { id: 9, nome: 'Patrícia Gomes', previa: 'Quero me informar sobre meus...', hora: 'Sex', tag: 'Orientação jurídica' },
];

const mensagensIniciais = {
    1: [
        { de: 'usuaria', hora: '10:12', texto: 'Olá... eu estou passando por uma situação muito difícil e não sei mais o que fazer. Meu parceiro tem sido muito agressivo emocionalmente e, algumas vezes, fisicamente. Eu tenho medo, mas também me sinto culpada e não sei se estou exagerando...' },
        { de: 'voluntaria', hora: '10:16', texto: 'Olá, Juliana. Eu sou Mariana, voluntária da ELLA. Você não está exagerando. O que você vive é violência e você não está sozinha. Podemos conversar sobre isso, tá bem?' },
        { de: 'usuaria', hora: '10:20', texto: 'Obrigada por me responder tão rápido... Eu realmente preciso conversar com alguém. Tenho muito medo de denunciar. Ele sempre diz que vai mudar, mas nada muda.' },
        { de: 'voluntaria', hora: '10:22', texto: 'Entendo como isso é difícil. Você é muito forte por estar aqui e buscar ajuda. Posso te orientar sobre os próximos passos e também te encaminhar para o nosso time de psicólogas, se quiser. Você gostaria de conversar com uma psicóloga?' },
        { de: 'usuaria', hora: '10:24', texto: 'Sim, por favor. Eu acho que preciso muito disso.' },
    ],
};

const acoes = [
    { texto: 'Encaminhar para psicóloga', icone: faBrain },
    { texto: 'Enviar orientações de segurança', icone: faShieldHalved },
    { texto: 'Compartilhar materiais', icone: faFileLines },
    { texto: 'Registrar atendimento', icone: faCircleCheck },
];

const informacoes = [
    { icone: faCalendarDays, texto: 'Último acesso: hoje, 10:12' },
    { icone: faHeart, texto: 'Tipo de solicitação: Apoio emocional' },
    { icone: faTriangleExclamation, texto: 'Possível risco: Alto', destaque: true },
    { icone: faFileLines, texto: 'Protocolo: #ELA-2025-0487' },
];

const card = 'rounded-xl bg-white shadow-sm';
const classeTag = (tag) =>
    tag === 'Urgente' ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700';

function ChatAdmin() {
    const [selecionadoId, setSelecionadoId] = useState(1);
    const [mensagens] = useState(mensagensIniciais);
    const [texto, setTexto] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState('');
    const {
        mensagens: salvas,
        carregando,
        erro,
        enviar: salvarMensagem,
        editar,
        excluir,
    } = useChatMessages(`admin:${selecionadoId}`);

    const conversa = conversas.find((c) => c.id === selecionadoId);
    const lista = mensagens[selecionadoId] ?? [];

    async function enviar(e) {
        e.preventDefault();
        const limpo = texto.trim();
        if (!limpo || enviando) return;

        setEnviando(true);
        setErroEnvio('');

        try {
            await salvarMensagem(limpo);
            setTexto('');
        } catch (error) {
            setErroEnvio(
                error.message || 'Não foi possível salvar a mensagem.',
            );
        } finally {
            setEnviando(false);
        }
    }

    return (
            <div className="grid gap-4 xl:h-[680px] xl:grid-cols-[19rem_1fr_19rem]">
                <section className={`${card} flex min-h-0 min-w-0 flex-col`} aria-label="Conversas">
                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-xl font-bold">Chats</h1>
                        <div className="flex gap-3 text-xs">
                            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Online</span>
                            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-600" />Todos</span>
                        </div>
                    </div>
                    <ul className="flex-1 overflow-y-auto px-2 pb-2">
                        {conversas.map((c) => (
                            <li key={c.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelecionadoId(c.id)}
                                    aria-current={c.id === selecionadoId}
                                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left ${c.id === selecionadoId ? 'bg-violet-100' : 'hover:bg-violet-50'}`}
                                >
                                    <Avatar nome={c.nome} tamanho="h-11 w-11" online />
                                    <span className="min-w-0 flex-1">
                                        <span className="flex justify-between gap-2">
                                            <span className="text-sm font-semibold">{c.nome}</span>
                                            <span className="text-xs text-gray-600">{c.hora}</span>
                                        </span>
                                        <span className="block truncate text-xs text-gray-600">{c.previa}</span>
                                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] ${classeTag(c.tag)}`}>{c.tag}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={`${card} flex min-h-[520px] min-w-0 flex-col xl:min-h-0`} aria-label={`Conversa com ${conversa.nome}`}>
                    <div className="flex flex-wrap items-center gap-3 border-b border-violet-100 p-4">
                        <Avatar nome={conversa.nome} />
                        <div className="mr-auto">
                            <h2 className="font-bold">{conversa.nome}</h2>
                            <p className="flex items-center gap-1 text-xs"><span className="h-2 w-2 rounded-full bg-emerald-500" />Online</p>
                        </div>
                        {[
                            { icone: faPhone, rotulo: 'Ligar' },
                            { icone: faVideo, rotulo: 'Chamada de vídeo' },
                            { icone: faEllipsisVertical, rotulo: 'Mais opções' },
                        ].map((b) => (
                            <button key={b.rotulo} type="button" aria-label={b.rotulo}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-[#5b21b6]">
                                <FontAwesomeIcon icon={b.icone} />
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        <p className="mx-auto w-fit rounded-full bg-violet-100 px-3 py-1 text-xs">Hoje, 10 de maio de 2025</p>
                        {lista.length === 0 && (
                            <p className="text-center text-sm text-gray-600">Nenhuma mensagem nesta conversa de exemplo.</p>
                        )}
                        {lista.map((m, i) => {
                            const minha = m.de === 'voluntaria';
                            return (
                                <div key={i} className={`flex items-end gap-2 ${minha ? 'flex-row-reverse' : ''}`}>
                                    <Avatar nome={minha ? usuario.nome : conversa.nome} tamanho="h-8 w-8" />
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${minha ? 'bg-pink-100' : 'bg-violet-100'}`}>
                                        <p>{m.texto}</p>
                                        <p className="mt-1 text-right text-[10px] text-gray-600">
                                            {m.hora}
                                            {minha && <FontAwesomeIcon icon={faCheckDouble} className="ml-1 text-violet-500" />}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {carregando && (
                            <p className="text-center text-xs text-gray-600">
                                Carregando mensagens salvas...
                            </p>
                        )}

                        {erro && (
                            <p role="alert" className="text-center text-xs text-red-600">
                                {erro}
                            </p>
                        )}

                        {salvas.map((m) => (
                            <SavedChatMessage
                                key={m.id}
                                mensagem={m}
                                alinhadaDireita
                                classeBalao="bg-pink-100 text-[#4c1d95]"
                                onEditar={editar}
                                onExcluir={excluir}
                                avatar={<Avatar nome={usuario.nome} tamanho="h-8 w-8" />}
                            />
                        ))}
                    </div>

                    {erroEnvio && (
                        <p role="alert" className="px-4 pb-2 text-xs text-red-600">
                            {erroEnvio}
                        </p>
                    )}

                    <form onSubmit={enviar} className="flex items-center gap-2 border-t border-violet-100 p-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-violet-50 px-4 py-2">
                            <input
                                type="text"
                                value={texto}
                                onChange={(e) => setTexto(e.target.value)}
                                maxLength={2000}
                                placeholder="Digite sua mensagem..."
                                aria-label="Mensagem"
                                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                            />
                            <button type="button" aria-label="Anexar arquivo" className="text-[#5b21b6]"><FontAwesomeIcon icon={faPaperclip} /></button>
                            <button type="button" aria-label="Emojis" className="text-[#5b21b6]"><FontAwesomeIcon icon={faFaceSmile} /></button>
                        </div>
                        <button type="submit" aria-label="Enviar mensagem" disabled={enviando}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white disabled:opacity-60">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </section>

                <aside className="min-h-0 min-w-0 space-y-4 overflow-y-auto" aria-label="Informações da usuária">
                    <section className={`${card} p-4`}>
                        <div className="flex items-center gap-3">
                            <Avatar nome={conversa.nome} tamanho="h-14 w-14" />
                            <div>
                                <h2 className="font-bold">{conversa.nome}</h2>
                                <p className="flex items-center gap-1 text-xs"><span className="h-2 w-2 rounded-full bg-emerald-500" />Online</p>
                                
                                <p className="text-xs text-gray-600">26 anos · São Paulo - SP</p>
                                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px]">Usuária</span>
                            </div>
                        </div>
                        <p className="mt-3 text-xs italic text-[#7e22ce]">“Quero ter paz... mas estou com muito medo de tudo isso.”</p>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                            {[
                                { icone: faUser, texto: 'Ver perfil' },
                                { icone: faClockRotateLeft, texto: 'Ver histórico' },
                                { icone: faBan, texto: 'Bloquear' },
                            ].map((b) => (
                                <button key={b.texto} type="button" className="flex flex-col items-center gap-1 rounded-lg bg-violet-50 py-2 text-[#5b21b6]">
                                    <FontAwesomeIcon icon={b.icone} />
                                    {b.texto}
                                </button>
                            ))}
                        </div>
                        <h3 className="mb-2 mt-4 text-sm font-bold">Informações importantes</h3>
                        <ul className="space-y-2 text-xs">
                            {informacoes.map((info) => (
                                <li key={info.texto} className={`flex items-center gap-2 ${info.destaque ? 'font-semibold text-pink-600' : ''}`}>
                                    <FontAwesomeIcon icon={info.icone} className="w-4" />
                                    {info.texto}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className={`${card} p-4`}>
                        <h3 className="mb-2 text-sm font-bold">Ações rápidas</h3>
                        <ul className="space-y-2">
                            {acoes.map((a) => (
                                <li key={a.texto}>
                                    <button type="button" className="flex w-full items-center gap-3 rounded-lg bg-pink-50 px-3 py-2 text-left text-xs">
                                        <FontAwesomeIcon icon={a.icone} className="w-4 text-pink-600" />
                                        {a.texto}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className={`${card} flex items-center gap-3 bg-pink-50 p-4 text-xs`}>
                        <FontAwesomeIcon icon={faHeart} className="text-xl text-pink-500" />
                        <p>Cada conversa importa.<br />Você faz a diferença!</p>
                    </section>
                </aside>
            </div>
    );
}

export default ChatAdmin;