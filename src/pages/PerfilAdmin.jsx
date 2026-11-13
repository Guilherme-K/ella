import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faShieldHalved,
    faCalendarDays,
    faLock,
    faArrowLeft,
    faUserGear,
    faCheckCircle,
    faRotate
} from '@fortawesome/free-solid-svg-icons';

import Avatar from '../components/Avatar';
import AvatarPicker from '../components/AvatarPicker';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import { userService } from '../services/userService';

const permissoes = [
    'Gerenciar usuárias',
    'Gerenciar voluntárias',
    'Acompanhar atendimentos',
    'Gerenciar denúncias',
    'Administrar conteúdos',
    'Acessar relatórios'
];

function formatarData(valor) {
    if (!valor) return '—';

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) return '—';

    return data.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
}

export default function PerfilAdmin() {
    const [administrador, setAdministrador] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [aviso, setAviso] = useState('');
    const [salvandoAvatar, setSalvandoAvatar] = useState(false);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            setCarregando(true);
            setErro('');

            try {
                const usuario = await userService.me();

                if (!ativo) return;

                setAdministrador(usuario);
            } catch (error) {
                if (ativo) {
                    setErro(
                        error.message ||
                            'Não foi possível carregar os dados da conta.'
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

    async function trocarAvatar(avatar) {
        if (!administrador) return;
        // Escolher um avatar pré-setado também remove a foto enviada.
        if (avatar === administrador.avatar && !administrador.photo) return;

        setSalvandoAvatar(true);
        setAviso('');

        try {
            const atualizado = await userService.updateMe({
                avatar,
                photo: null
            });
            setAdministrador(atualizado);
            setAviso(
                administrador.photo
                    ? 'Avatar atualizado e foto removida.'
                    : 'Avatar atualizado.'
            );
        } catch (error) {
            setAviso(error.message || 'Não foi possível atualizar o avatar.');
        } finally {
            setSalvandoAvatar(false);
        }
    }

    async function enviarFoto(photo) {
        setAviso('');

        const atualizado = await userService.updateMe({ photo });
        setAdministrador(atualizado);
        setAviso('Foto de perfil atualizada.');
    }

    async function removerFoto() {
        setAviso('');

        const atualizado = await userService.updateMe({ photo: null });
        setAdministrador(atualizado);
        setAviso('Foto removida. Seu avatar escolhido voltou a aparecer.');
    }

    if (carregando) {
        return (
            <div className="mx-auto max-w-5xl">
                <p className="rounded-2xl bg-white p-6 text-sm text-gray-600 shadow-sm">
                    Carregando dados da administradora...
                </p>
            </div>
        );
    }

    if (erro || !administrador) {
        return (
            <div className="mx-auto max-w-5xl">
                <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-violet-950">
                        Não foi possível abrir o perfil
                    </h1>
                    <p role="alert" className="text-sm text-red-600">
                        {erro || 'Sessão não encontrada. Faça login novamente.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setRecarregar((valor) => valor + 1)}
                        className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-800"
                    >
                        <FontAwesomeIcon icon={faRotate} />
                        Tentar novamente
                    </button>
                </section>
            </div>
        );
    }

    const nome = administrador.name ?? administrador.nome ?? 'Admin ELLA';
    const email = administrador.email ?? '—';

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-violet-950">
                        Meu perfil
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Visualize suas informações administrativas.
                    </p>
                </div>

                <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-800 transition hover:bg-violet-50"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Voltar
                </Link>
            </div>

            {aviso && (
                <p role="status" className="rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                    {aviso}
                </p>
            )}

            <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="h-32 bg-gradient-to-r from-violet-950 to-purple-700" />

                <div className="px-6 pb-6">
                    <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-violet-100 shadow-sm">
                            <Avatar
                                nome={nome}
                                avatar={administrador.avatar}
                                photo={administrador.photo}
                                tamanho="h-24 w-24 text-4xl"
                            />
                        </div>

                        <div className="pb-2">
                            <h2 className="text-xl font-bold text-gray-800">
                                {nome}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Administradora
                            </p>
                        </div>

                        <div className="sm:ml-auto sm:pb-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                Conta ativa
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">

                <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <FontAwesomeIcon
                            icon={faUserGear}
                            className="text-violet-700"
                        />
                        <h3 className="font-bold text-violet-950">
                            Informações da conta
                        </h3>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <p className="mb-2 text-xs font-medium text-gray-600">
                                Nome
                            </p>
                            <p className="flex items-center gap-2 font-medium text-gray-800">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-violet-500"
                                />
                                {nome}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium text-gray-600">
                                Tipo de conta
                            </p>
                            <p className="font-medium text-gray-800">
                                Administradora
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium text-gray-600">
                                E-mail
                            </p>
                            <p className="flex items-center gap-2 break-all font-medium text-gray-800">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="text-violet-500"
                                />
                                {email}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium text-gray-600">
                                Data de cadastro
                            </p>
                            <p className="flex items-center gap-2 font-medium text-gray-800">
                                <FontAwesomeIcon
                                    icon={faCalendarDays}
                                    className="text-violet-500"
                                />
                                {formatarData(administrador.createdAt)}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                        <FontAwesomeIcon
                            icon={faLock}
                            className="text-violet-700"
                        />
                        <h3 className="font-bold text-violet-950">
                            Segurança
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                Senha
                            </p>
                            <p className="mt-1 text-xs text-gray-600">
                                Proteção da conta administrativa.
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                Acesso administrativo
                            </p>
                            <p className="mt-1 text-xs text-gray-600">
                                Conta com permissões de gerenciamento.
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800">
                            <FontAwesomeIcon icon={faShieldHalved} />
                            Acesso administrativo
                        </span>
                    </div>
                </section>
            </div>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold text-violet-950">
                        Avatar
                    </h3>
                    <span className="text-xs text-gray-600">
                        {salvandoAvatar ? 'Salvando...' : 'A escolha fica salva na sua conta.'}
                    </span>
                </div>

                <ProfilePhotoUpload
                    nome={nome}
                    avatar={administrador.avatar}
                    photo={administrador.photo}
                    onUpload={enviarFoto}
                    onRemove={removerFoto}
                />

                <div className="my-5 border-t border-gray-100" />

                <p className="mb-3 text-xs text-gray-600">
                    Ou escolha um avatar pré-setado. Ao escolher um avatar, a
                    foto enviada é removida.
                </p>

                <AvatarPicker
                    value={administrador.avatar}
                    onChange={trocarAvatar}
                    disabled={salvandoAvatar}
                />
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                    <FontAwesomeIcon
                        icon={faShieldHalved}
                        className="text-violet-700"
                    />
                    <h3 className="font-bold text-violet-950">
                        Permissões da conta
                    </h3>
                </div>

                <p className="mb-4 text-sm text-gray-600">
                    Ações disponíveis para o perfil administrativo.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {permissoes.map((permissao) => (
                        <div
                            key={permissao}
                            className="flex items-center gap-3 rounded-xl bg-violet-50 p-3"
                        >
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-violet-600"
                            />
                            <span className="text-sm text-violet-950">
                                {permissao}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
