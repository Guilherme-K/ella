import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faLock, faPen } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../components/Avatar';

// ---------------------------------------------------------------------------
// TEMPORÁRIO: enquanto o back não existe, os dados abaixo são de exemplo.
// TODO: trocar `usuarioExemplo` pelo usuário logado (useAuth ou GET /usuarios/me).
// TODO: em `salvar` e `escolherFoto`, chamar a API e só mostrar sucesso depois da resposta.
// O nível da conta (papel) é só exibido aqui. Quem decide o que cada papel pode
// fazer é o back, a cada requisição; a usuária nunca edita o próprio papel.
// ---------------------------------------------------------------------------
const MODO_TESTE = true;

const usuarioExemplo = {
    nome: 'Mariana Costa de Oliveira',
    apelido: 'Mari',
    email: 'mariana.costa@email.com',
    papel: 'voluntaria', // 'usuaria' | 'voluntaria' | 'psicologa' | 'admin'
    bio: 'Voluntária desde 2025. Acredito que ouvir também é cuidar.',
    cidade: 'São Paulo - SP',
    telefone: '(11) 98765-4321',
    membroDesde: 'março de 2025',
    areas: ['Acolhimento', 'Eventos'], // voluntária
    crp: '', // psicóloga: registro profissional
    especialidades: [], // psicóloga
    saidaRapida: 'https://www.google.com.br',
    mostrarFoto: true,
};

const papeis = {
    usuaria: { rotulo: 'Usuária', classe: 'bg-pink-100 text-pink-700' },
    voluntaria: { rotulo: 'Voluntária', classe: 'bg-violet-100 text-violet-700' },
    psicologa: { rotulo: 'Psicóloga', classe: 'bg-fuchsia-100 text-fuchsia-700' },
    admin: { rotulo: 'Admin', classe: 'bg-[#2e1065] text-white' },
};

// Só aceita sites desta lista (nunca texto livre), para ninguém salvar um link malicioso.
const sitesSaidaRapida = [
    { nome: 'Google', url: 'https://www.google.com.br' },
    { nome: 'Wikipédia', url: 'https://pt.wikipedia.org' },
    { nome: 'G1', url: 'https://g1.globo.com' },
];

const tiposFoto = ['image/png', 'image/jpeg', 'image/webp'];
const tamanhoMaximoFoto = 2 * 1024 * 1024; // 2 MB
const limiteBio = 280;

const card = 'rounded-2xl border border-violet-100 bg-white p-6';
const titulo = 'mb-4 font-serif text-lg text-[#2e1065]';
const campo = 'w-full rounded-xl border border-violet-200 bg-[#faf5ff] px-4 py-2 text-sm';
const botaoSecundario = 'rounded-full border border-violet-200 px-4 py-2 text-sm text-[#5b21b6] hover:bg-violet-50';

function Etiquetas({ itens }) {
    if (!itens.length) return <span className="text-sm text-gray-500">Nada informado.</span>;
    return (
        <ul className="flex flex-wrap gap-2">
            {itens.map((item) => (
                <li key={item} className="rounded-full bg-violet-50 px-3 py-1 text-xs text-[#5b21b6]">{item}</li>
            ))}
        </ul>
    );
}

function Linha({ rotulo, children }) {
    return (
        <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
            <dt className="text-xs uppercase tracking-wide text-gray-400">{rotulo}</dt>
            <dd className="text-sm">{children}</dd>
        </div>
    );
}

function Perfil() {
    const [perfil, setPerfil] = useState(usuarioExemplo);
    const [rascunho, setRascunho] = useState(usuarioExemplo);
    const [fotoUrl, setFotoUrl] = useState('');
    const [editando, setEditando] = useState(false);
    const [aviso, setAviso] = useState(null);
    const inputFoto = useRef(null);

    const papel = papeis[perfil.papel];
    const exibicao = perfil.apelido || perfil.nome;
    const nomeSaida = sitesSaidaRapida.find((s) => s.url === perfil.saidaRapida)?.nome ?? 'Não definida';

    function mostrarAviso(texto, erro = false) {
        setAviso({ texto, erro });
    }

    function escolherFoto(e) {
        const arquivo = e.target.files[0];
        e.target.value = '';
        if (!arquivo) return;

        if (!tiposFoto.includes(arquivo.type)) {
            mostrarAviso('Use uma imagem PNG, JPG ou WebP.', true);
            return;
        }
        if (arquivo.size > tamanhoMaximoFoto) {
            mostrarAviso('A imagem deve ter no máximo 2 MB.', true);
            return;
        }

        if (fotoUrl) URL.revokeObjectURL(fotoUrl);
        // TODO: enviar `arquivo` para a API (multipart) e guardar a URL que ela devolver.
        setFotoUrl(URL.createObjectURL(arquivo));
        mostrarAviso(MODO_TESTE ? 'Modo de teste: a foto aparece só nesta tela.' : 'Foto atualizada.');
    }

    function removerFoto() {
        if (fotoUrl) URL.revokeObjectURL(fotoUrl);
        setFotoUrl('');
        mostrarAviso('Foto removida.');
    }

    function iniciarEdicao() {
        setRascunho(perfil);
        setAviso(null);
        setEditando(true);
    }

    function mudarRascunho(e) {
        const { name, value, type, checked } = e.target;
        setRascunho((atual) => ({ ...atual, [name]: type === 'checkbox' ? checked : value }));
    }

    function salvar(e) {
        e.preventDefault();
        // TODO: await PUT /usuarios/me com `rascunho` e só continuar se o back responder ok.
        setPerfil(rascunho);
        setEditando(false);
        mostrarAviso(MODO_TESTE ? 'Modo de teste: as alterações aparecem só nesta tela.' : 'Alterações salvas.');
    }

    return (
        <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 text-[#2e1065]">
            {MODO_TESTE && (
                <p className="rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-800">
                    Modo de teste: os dados são de exemplo e nada é enviado ao servidor.
                </p>
            )}
            {aviso && (
                <p role="status" className={`rounded-xl px-4 py-2 text-sm ${aviso.erro ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>
                    {aviso.texto}
                </p>
            )}

            <section className={`${card} flex flex-col gap-6 sm:flex-row sm:items-center`}>
                {fotoUrl ? (
                    <img src={fotoUrl} alt={`Foto de perfil de ${exibicao}`} className="h-28 w-28 rounded-full object-cover" />
                ) : (
                    <Avatar nome={exibicao} tamanho="h-28 w-28 text-3xl" />
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-serif text-3xl">{exibicao}</h1>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${papel.classe}`}>{papel.rotulo}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{perfil.email} · membro desde {perfil.membroDesde}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <input ref={inputFoto} type="file" accept={tiposFoto.join(',')} onChange={escolherFoto} className="hidden" />
                        <button type="button" onClick={() => inputFoto.current.click()} className={botaoSecundario}>
                            <FontAwesomeIcon icon={faCamera} className="mr-2" />
                            Alterar foto
                        </button>
                        {fotoUrl && (
                            <button type="button" onClick={removerFoto} className={botaoSecundario}>Remover foto</button>
                        )}
                    </div>
                </div>

                {!editando && (
                    <button type="button" onClick={iniciarEdicao}
                        className="self-start rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white sm:self-center">
                        <FontAwesomeIcon icon={faPen} className="mr-2" />
                        Editar perfil
                    </button>
                )}
            </section>

            <form onSubmit={salvar} className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                <div className="space-y-6">
                    <section className={card}>
                        <h2 className={titulo}>Sobre mim</h2>
                        {editando ? (
                            <>
                                <label htmlFor="bio" className="sr-only">Bio</label>
                                <textarea id="bio" name="bio" rows={4} maxLength={limiteBio}
                                    value={rascunho.bio} onChange={mudarRascunho} className={campo}
                                    placeholder="Conte um pouco sobre você (não coloque dados que te identifiquem se não quiser)." />
                                <p className="mt-1 text-right text-xs text-gray-400">{rascunho.bio.length}/{limiteBio}</p>
                            </>
                        ) : (
                            <p className="text-sm">{perfil.bio || <span className="text-gray-500">Você ainda não escreveu uma bio.</span>}</p>
                        )}
                    </section>

                    <section className={card}>
                        <h2 className={titulo}>Dados do perfil</h2>
                        <dl className="divide-y divide-violet-100">
                            <Linha rotulo="Nome">
                                {perfil.nome}
                                <span className="ml-2 text-xs text-gray-400">(para alterar, use Minha conta)</span>
                            </Linha>
                            <Linha rotulo="Apelido">
                                {editando ? (
                                    <>
                                        <label htmlFor="apelido" className="sr-only">Apelido</label>
                                        <input id="apelido" name="apelido" value={rascunho.apelido} onChange={mudarRascunho}
                                            maxLength={40} className={campo} placeholder="Como você quer ser chamada" />
                                    </>
                                ) : (perfil.apelido || '—')}
                            </Linha>
                            <Linha rotulo="Cidade / Estado">
                                {editando ? (
                                    <>
                                        <label htmlFor="cidade" className="sr-only">Cidade e estado</label>
                                        <input id="cidade" name="cidade" value={rascunho.cidade} onChange={mudarRascunho}
                                            maxLength={60} className={campo} />
                                    </>
                                ) : (perfil.cidade || '—')}
                            </Linha>
                            <Linha rotulo="Telefone">
                                {editando ? (
                                    <>
                                        <label htmlFor="telefone" className="sr-only">Telefone</label>
                                        <input id="telefone" name="telefone" type="tel" value={rascunho.telefone}
                                            onChange={mudarRascunho} className={campo} />
                                    </>
                                ) : (perfil.telefone || '—')}
                                <p className="mt-1 text-xs text-gray-400">
                                    <FontAwesomeIcon icon={faLock} className="mr-1" />
                                    Visível só para você.
                                </p>
                            </Linha>
                        </dl>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className={card}>
                        <h2 className={titulo}>Conta</h2>
                        <dl className="divide-y divide-violet-100">
                            <Linha rotulo="Nível">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${papel.classe}`}>{papel.rotulo}</span>
                                <p className="mt-1 text-xs text-gray-400">Definido pela equipe da ELLA.</p>
                            </Linha>
                            {perfil.papel === 'voluntaria' && (
                                <Linha rotulo="Áreas de atuação"><Etiquetas itens={perfil.areas} /></Linha>
                            )}
                            {perfil.papel === 'psicologa' && (
                                <>
                                    {/* TODO: o registro (CRP) deve ser conferido pela equipe antes de aparecer como verificado */}
                                    <Linha rotulo="CRP">{perfil.crp || 'Não informado'}</Linha>
                                    <Linha rotulo="Especialidades"><Etiquetas itens={perfil.especialidades} /></Linha>
                                </>
                            )}
                            <Linha rotulo="Saída Rápida">
                                {editando ? (
                                    <>
                                        <label htmlFor="saidaRapida" className="sr-only">Site da Saída Rápida</label>
                                        <select id="saidaRapida" name="saidaRapida" value={rascunho.saidaRapida}
                                            onChange={mudarRascunho} className={campo}>
                                            {sitesSaidaRapida.map((s) => (
                                                <option key={s.url} value={s.url}>{s.nome}</option>
                                            ))}
                                        </select>
                                    </>
                                ) : nomeSaida}
                                <p className="mt-1 text-xs text-gray-400">Para onde o botão leva você num clique.</p>
                            </Linha>
                        </dl>
                    </section>

                    <section className={card}>
                        <h2 className={titulo}>Privacidade</h2>
                        <label className="flex items-start gap-3 text-sm">
                            <input type="checkbox" name="mostrarFoto" checked={editando ? rascunho.mostrarFoto : perfil.mostrarFoto}
                                onChange={mudarRascunho} disabled={!editando} className="mt-1" />
                            <span>
                                Mostrar minha foto nas conversas
                                <span className="block text-xs text-gray-400">Se desmarcado, aparecem só as suas iniciais.</span>
                            </span>
                        </label>
                    </section>
                </div>

                {editando && (
                    <div className="flex gap-3 lg:col-span-2">
                        <button type="submit" className="rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white">
                            Salvar alterações
                        </button>
                        <button type="button" onClick={() => setEditando(false)} className={botaoSecundario}>Cancelar</button>
                    </div>
                )}
            </form>
        </main>
    );
}

export default Perfil;