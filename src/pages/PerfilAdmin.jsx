
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
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default function PerfilAdmin() {
    const administrador = {
        nome: 'Admin ELLA',
        email: 'admin@ella.com',
        cargo: 'Administradora',
        status: 'Conta ativa',
        cadastro: 'Novembro de 2026',
        permissoes: [
            'Gerenciar usuárias',
            'Gerenciar voluntárias',
            'Acompanhar atendimentos',
            'Gerenciar denúncias',
            'Administrar conteúdos',
            'Acessar relatórios'
        ]
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-violet-950">
                        Meu perfil
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
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

            <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="h-32 bg-gradient-to-r from-violet-950 to-purple-700" />

                <div className="px-6 pb-6">
                    <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-violet-100 text-4xl text-violet-800 shadow-sm">
                            <FontAwesomeIcon icon={faUser} />
                        </div>

                        <div className="pb-2">
                            <h2 className="text-xl font-bold text-gray-800">
                                {administrador.nome}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {administrador.cargo}
                            </p>
                        </div>

                        <div className="sm:ml-auto sm:pb-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                {administrador.status}
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
                            <p className="mb-2 text-xs font-medium text-gray-400">
                                Nome
                            </p>
                            <p className="font-medium text-gray-800">
                                {administrador.nome}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium text-gray-400">
                                Tipo de conta
                            </p>
                            <p className="font-medium text-gray-800">
                                {administrador.cargo}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium text-gray-400">
                                E-mail
                            </p>
                            <p className="flex items-center gap-2 break-all font-medium text-gray-800">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="text-violet-500"
                                />
                                {administrador.email}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium text-gray-400">
                                Data de cadastro
                            </p>
                            <p className="flex items-center gap-2 font-medium text-gray-800">
                                <FontAwesomeIcon
                                    icon={faCalendarDays}
                                    className="text-violet-500"
                                />
                                {administrador.cadastro}
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
                            <p className="mt-1 text-xs text-gray-500">
                                Proteção da conta administrativa.
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                Acesso administrativo
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
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
                <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                    <FontAwesomeIcon
                        icon={faShieldHalved}
                        className="text-violet-700"
                    />
                    <h3 className="font-bold text-violet-950">
                        Permissões da conta
                    </h3>
                </div>

                <p className="mb-4 text-sm text-gray-500">
                    Ações disponíveis para o perfil administrativo.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {administrador.permissoes.map((permissao) => (
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
