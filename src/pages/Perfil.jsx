import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faPen, faRotate } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../components/Avatar';
import AvatarPicker from '../components/AvatarPicker';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import { userService } from '../services/userService';
import {
    PREFERENCIAS_KEY,
    SITES_SAIDA_RAPIDA,
    lerPreferencias,
    nomeSaidaRapida,
} from '../constants/saidaRapida';

// ---------------------------------------------------------------------------
// Página "Minha área".
// Os dados vêm de GET /api/users/me (token salvo no login) e as alterações são
// enviadas para PATCH /api/users/me. O nível da conta (papel) é só exibido:
// quem decide o que cada papel pode fazer é o back, a cada requisição; a
// usuária nunca edita o próprio papel.
// ---------------------------------------------------------------------------

const papeis = {
    usuaria: { rotulo: 'Usuária', classe: 'bg-pink-100 text-pink-700' },
    voluntaria: { rotulo: 'Voluntária', classe: 'bg-violet-100 text-violet-700' },
    psicologa: { rotulo: 'Psicóloga', classe: 'bg-fuchsia-100 text-fuchsia-700' },
    admin: { rotulo: 'Admin', classe: 'bg-[#2e1065] text-white' },
};

const limiteBio = 280;

const card = 'rounded-2xl border border-violet-100 bg-white p-6';
const titulo = 'mb-4 font-serif text-lg text-[#2e1065]';
const campo = 'w-full rounded-xl border border-violet-200 bg-[#faf5ff] px-4 py-2 text-sm';
const botaoSecundario = 'rounded-full border border-violet-200 px-4 py-2 text-sm text-[#5b21b6] hover:bg-violet-50';

function normalizarPerfil(user) {
    const preferencias = lerPreferencias();

    return {
        id: user.id,
        nome: user.name ?? user.nome ?? '',
        apelido: user.nickname ?? user.apelido ?? '',
        email: user.email ?? '',
        tipo: user.role ?? user.tipo ?? 'usuaria',
        avatar: user.avatar || 'avatar-1',
        photo: user.photo || '',
        bio: user.bio ?? '',
        cidade: user.city ?? user.cidade ?? '',
        telefone: user.phone ?? user.telefone ?? '',
        criadoEm: user.createdAt ?? user.criadoEm ?? null,
        ...preferencias,
    };
}

function formatarData(valor) {
    if (!valor) return '—';

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) return '—';

    return data.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });
}

function Linha({ rotulo, children }) {
    return (
        <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
            <dt className="text-xs uppercase tracking-wide text-gray-600">{rotulo}</dt>
            <dd className="text-sm">{children}</dd>
        </div>
    );
}

function Perfil() {
    const [perfil, setPerfil] = useState(null);
    const [rascunho, setRascunho] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [editando, setEditando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [salvandoAvatar, setSalvandoAvatar] = useState(false);
    const [aviso, setAviso] = useState(null);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            setCarregando(true);
            setErro('');

            try {
                const usuario = await userService.me();

                if (!ativo) return;

                const normalizado = normalizarPerfil(usuario);
                setPerfil(normalizado);
                setRascunho(normalizado);
            } catch (error) {
                if (ativo) {
                    setErro(
                        error.message ||
                            'Não foi possível carregar os dados da sua conta.',
                    );
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

    function mostrarAviso(texto, erroAviso = false) {
        setAviso({ texto, erro: erroAviso });
    }

    function iniciarEdicao() {
        setRascunho(perfil);
        setAviso(null);
        setEditando(true);
    }

    function mudarRascunho(event) {
        const { name, value, type, checked } = event.target;
        setRascunho((atual) => ({
            ...atual,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

async function salvar(event) {
        event.preventDefault();
        setSalvando(true);

        try {
            const atualizado = await userService.updateMe({
                apelido: rascunho.apelido,
                bio: rascunho.bio,
                cidade: rascunho.cidade,
                telefone: rascunho.telefone,
            });

            localStorage.setItem(
                PREFERENCIAS_KEY,
                JSON.stringify({
                    saidaRapida: rascunho.saidaRapida,
                    mostrarFoto: rascunho.mostrarFoto,
                }),
            );

            if (rascunho.saidaRapida) {
                localStorage.setItem('ella_link_saida_rapida', rascunho.saidaRapida);
            }

            const normalizado = normalizarPerfil(atualizado);
            setPerfil({ ...normalizado, saidaRapida: rascunho.saidaRapida, mostrarFoto: rascunho.mostrarFoto });
            setRascunho(normalizado);
            setEditando(false);
            mostrarAviso('Alterações salvas.');
        } catch (error) {
            mostrarAviso(
                error.message || 'Não foi possível salvar as alterações.',
                true,
            );
        } finally {
            setSalvando(false);
        }
    }

    async function trocarAvatar(avatar) {
        if (!perfil) return;
        // Escolher um avatar pré-setado também remove a foto enviada.
        if (avatar === perfil.avatar && !perfil.photo) return;

        setSalvandoAvatar(true);

        try {
            const atualizado = await userService.updateMe({
                avatar,
                photo: null,
            });
            const normalizado = normalizarPerfil(atualizado);

            setPerfil((atual) => ({
                ...normalizado,
                saidaRapida: atual.saidaRapida,
                mostrarFoto: atual.mostrarFoto,
            }));
            setRascunho((atual) =>
                atual
                    ? {
                          ...atual,
                          avatar: normalizado.avatar,
                          photo: normalizado.photo,
                      }
                    : atual,
            );
            mostrarAviso(
                perfil.photo
                    ? 'Avatar atualizado e foto removida.'
                    : 'Avatar atualizado.',
            );
        } catch (error) {
            mostrarAviso(
                error.message || 'Não foi possível atualizar o avatar.',
                true,
            );
        } finally {
            setSalvandoAvatar(false);
        }
    }

    async function enviarFoto(photo) {
        const atualizado = await userService.updateMe({ photo });
        const normalizado = normalizarPerfil(atualizado);

        setPerfil((atual) => ({
            ...normalizado,
            saidaRapida: atual.saidaRapida,
            mostrarFoto: atual.mostrarFoto,
        }));
        setRascunho((atual) =>
            atual ? { ...atual, photo: normalizado.photo } : atual,
        );
        mostrarAviso('Foto de perfil atualizada.');
    }

    async function removerFoto() {
        const atualizado = await userService.updateMe({ photo: null });
        const normalizado = normalizarPerfil(atualizado);

        setPerfil((atual) => ({
            ...normalizado,
            saidaRapida: atual.saidaRapida,
            mostrarFoto: atual.mostrarFoto,
        }));
        setRascunho((atual) =>
            atual ? { ...atual, photo: normalizado.photo } : atual,
        );
        mostrarAviso('Foto removida. Seu avatar escolhido voltou a aparecer.');
    }

    if (carregando) {
        return (
            <main id="conteudo" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 text-[#2e1065]">
                <p className={`${card} text-sm text-gray-500`}>
                    Carregando seus dados...
                </p>
            </main>
        );
    }

    if (erro || !perfil) {
        return (
            <main id="conteudo" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 text-[#2e1065]">
                <section className={`${card} space-y-4`}>
                    <h1 className="font-serif text-2xl">Não foi possível abrir sua área</h1>
                    <p role="alert" className="text-sm text-red-600">
                        {erro || 'Sessão não encontrada. Faça login novamente.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setRecarregar((valor) => valor + 1)}
                        className="rounded-full bg-pink-700 px-5 py-2 text-sm font-semibold text-white"
                    >
                        <FontAwesomeIcon icon={faRotate} className="mr-2" />
                        Tentar novamente
                    </button>
                </section>
            </main>
        );
    }

    const papel = papeis[perfil.tipo] || papeis.usuaria;
    const exibicao = perfil.apelido || perfil.nome || 'Minha conta';
    const nomeSaida = nomeSaidaRapida(perfil.saidaRapida);

    return (
        <main id="conteudo" tabIndex={-1} className="mx-auto max-w-5xl space-y-6 px-4 py-8 text-[#2e1065]">
            {aviso && (
                <p
                    role="status"
                    className={`rounded-xl px-4 py-2 text-sm ${
                        aviso.erro
                            ? 'bg-red-50 text-red-700'
                            : 'bg-emerald-50 text-emerald-800'
                    }`}
                >
                    {aviso.texto}
                </p>
            )}

            <section className={`${card} flex flex-col gap-6 sm:flex-row sm:items-center`}>
                <Avatar
                    nome={exibicao}
                    avatar={perfil.avatar}
                    photo={perfil.photo}
                    tamanho="h-28 w-28 text-4xl"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-serif text-3xl">{exibicao}</h1>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${papel.classe}`}>
                            {papel.rotulo}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        {perfil.email} · membro desde {formatarData(perfil.criadoEm)}
                    </p>
                    <p className="mt-2 text-xs text-gray-600">
                        Nome completo: {perfil.nome || '—'}
                    </p>
                </div>

                {!editando && (
                    <button
                        type="button"
                        onClick={iniciarEdicao}
                        className="self-start rounded-full bg-pink-700 px-5 py-2 text-sm font-semibold text-white sm:self-center"
                    >
                        <FontAwesomeIcon icon={faPen} className="mr-2" />
                        Editar perfil
                    </button>
                )}
            </section>

            <section className={card}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className={`${titulo} mb-0`}>Avatar</h2>
                    <span className="text-xs text-gray-600">
                        {salvandoAvatar ? 'Salvando...' : 'A escolha fica salva na sua conta.'}
                    </span>
                </div>

                <ProfilePhotoUpload
                    nome={exibicao}
                    avatar={perfil.avatar}
                    photo={perfil.photo}
                    onUpload={enviarFoto}
                    onRemove={removerFoto}
                />

                <div className="my-5 border-t border-violet-100" />

                <p className="mb-3 text-xs text-gray-600">
                    Ou escolha um avatar pré-setado. Ao escolher um avatar, a
                    foto enviada é removida.
                </p>

                <AvatarPicker
                    value={perfil.avatar}
                    onChange={trocarAvatar}
                    disabled={salvandoAvatar}
                />
            </section>

            <form onSubmit={salvar} className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                <div className="space-y-6">
                    <section className={card}>
                        <h2 className={titulo}>Sobre mim</h2>
                        {editando ? (
                            <>
                                <label htmlFor="bio" className="sr-only">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={4}
                                    maxLength={limiteBio}
                                    value={rascunho.bio}
                                    onChange={mudarRascunho}
                                    className={campo}
                                    placeholder="Conte um pouco sobre você (não coloque dados que te identifiquem se não quiser)."
                                />
                                <p className="mt-1 text-right text-xs text-gray-600">
                                    {rascunho.bio.length}/{limiteBio}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm">
                                {perfil.bio || (
                                    <span className="text-gray-500">
                                        Você ainda não escreveu uma bio.
                                    </span>
                                )}
                            </p>
                        )}
                    </section>

                    <section className={card}>
                        <h2 className={titulo}>Dados do perfil</h2>
                        <dl className="divide-y divide-violet-100">
                            <Linha rotulo="Nome">
                                {perfil.nome}
                                <span className="ml-2 text-xs text-gray-600">
                                    (definido no cadastro)
                                </span>
                            </Linha>
                            <Linha rotulo="Apelido">
                                {editando ? (
                                    <>
                                        <label htmlFor="apelido" className="sr-only">Apelido</label>
                                        <input
                                            id="apelido"
                                            name="apelido"
                                            value={rascunho.apelido}
                                            onChange={mudarRascunho}
                                            maxLength={40}
                                            className={campo}
                                            placeholder="Como você quer ser chamada"
                                        />
                                    </>
                                ) : (
                                    perfil.apelido || '—'
                                )}
                            </Linha>
                            <Linha rotulo="Cidade / Estado">
                                {editando ? (
                                    <>
                                        <label htmlFor="cidade" className="sr-only">Cidade e estado</label>
                                        <input
                                            id="cidade"
                                            name="cidade"
                                            value={rascunho.cidade}
                                            onChange={mudarRascunho}
                                            maxLength={60}
                                            className={campo}
                                        />
                                    </>
                                ) : (
                                    perfil.cidade || '—'
                                )}
                            </Linha>
                            <Linha rotulo="Telefone">
                                {editando ? (
                                    <>
                                        <label htmlFor="telefone" className="sr-only">Telefone</label>
                                        <input
                                            id="telefone"
                                            name="telefone"
                                            type="tel"
                                            value={rascunho.telefone}
                                            onChange={mudarRascunho}
                                            className={campo}
                                        />
                                    </>
                                ) : (
                                    perfil.telefone || '—'
                                )}
                                <p className="mt-1 text-xs text-gray-600">
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
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${papel.classe}`}>
                                    {papel.rotulo}
                                </span>
                                <p className="mt-1 text-xs text-gray-600">
                                    Definido pela equipe da ELLA.
                                </p>
                            </Linha>
                            <Linha rotulo="Saída Rápida">
                                {editando ? (
                                    <>
                                        <label htmlFor="saidaRapida" className="sr-only">
                                            Site da Saída Rápida
                                        </label>
                                        <select
                                            id="saidaRapida"
                                            name="saidaRapida"
                                            value={rascunho.saidaRapida}
                                            onChange={mudarRascunho}
                                            className={campo}
                                        >
                                            {SITES_SAIDA_RAPIDA.map((site) => (
                                                <option key={site.url} value={site.url}>
                                                    {site.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                ) : (
                                    nomeSaida
                                )}
                                <p className="mt-1 text-xs text-gray-600">
                                    Para onde o botão leva você num clique.
                                </p>
                            </Linha>
                        </dl>
                    </section>

                    <section className={card}>
                        <h2 className={titulo}>Privacidade</h2>
                        <label className="flex items-start gap-3 text-sm">
                            <input
                                type="checkbox"
                                name="mostrarFoto"
                                checked={editando ? rascunho.mostrarFoto : perfil.mostrarFoto}
                                onChange={mudarRascunho}
                                disabled={!editando}
                                className="mt-1"
                            />
                            <span>
                                Mostrar meu avatar nas conversas
                                <span className="block text-xs text-gray-600">
                                    Se desmarcado, aparecem só as suas iniciais.
                                </span>
                            </span>
                        </label>
                    </section>
                </div>

                {editando && (
                    <div className="flex gap-3 lg:col-span-2">
                        <button
                            type="submit"
                            disabled={salvando}
                            className="rounded-full bg-pink-700 px-6 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {salvando ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setRascunho(perfil);
                                setEditando(false);
                            }}
                            className={botaoSecundario}
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </form>
        </main>
    );
}

export default Perfil;
