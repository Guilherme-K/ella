import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faHandHoldingHeart,
    faImage,
    faPenToSquare,
    faPhone,
    faPlus,
    faRotate,
    faTrashCan,
    faUpload,
    faXmark
} from '@fortawesome/free-solid-svg-icons';

import { supportNetworkService } from '../services/supportNetworkService';
import {
    CATEGORIAS_REDE,
    IMAGENS_REDES,
    MAX_CARACTERES_CATEGORIA,
    MAX_CARACTERES_DETALHES,
    MAX_CARACTERES_NOME,
    MAX_CARACTERES_SITE,
    MAX_CARACTERES_TELEFONE,
    MAX_IMAGEM_BYTES,
    MAX_PALAVRAS_DESCRICAO,
    contarPalavras,
    imagemDaRede,
    linkTelefone,
    siteSeguro
} from '../constants/supportNetworks';

const TIPOS_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'];

const card = 'rounded-2xl border border-violet-100 bg-white p-6';
const campo = 'w-full rounded-xl border border-violet-200 bg-[#faf5ff] px-4 py-2 text-sm';
const botaoPrimario = 'inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60';
const botaoSecundario = 'inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 px-4 py-2 text-sm font-semibold text-[#5b21b6] transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60';

function lerArquivoComoDataUrl(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = () => resolve(String(leitor.result));
        leitor.onerror = () =>
            reject(new Error('Não foi possível ler a imagem.'));
        leitor.readAsDataURL(arquivo);
    });
}

const formularioVazio = {
    id: null,
    nome: '',
    categoria: '',
    descricao: '',
    detalhes: '',
    site: '',
    telefone: '',
    imagem: ''
};

export default function AdminRedesApoio() {
    const [redes, setRedes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [aviso, setAviso] = useState(null);
    const [formAberto, setFormAberto] = useState(false);
    const [form, setForm] = useState(formularioVazio);
    const [erroForm, setErroForm] = useState('');
    const [salvando, setSalvando] = useState(false);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro('');

        try {
            setRedes(await supportNetworkService.list());
        } catch (error) {
            setErro(
                error.message || 'Não foi possível carregar as redes de apoio.'
            );
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        let ativo = true;

        async function carregarInicial() {
            setCarregando(true);
            setErro('');

            try {
                const lista = await supportNetworkService.list();
                if (ativo) setRedes(lista);
            } catch (error) {
                if (ativo) {
                    setErro(
                        error.message ||
                            'Não foi possível carregar as redes de apoio.'
                    );
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarInicial();

        return () => {
            ativo = false;
        };
    }, []);

    function abrirNova() {
        setForm(formularioVazio);
        setErroForm('');
        setFormAberto(true);
    }

    function abrirEdicao(rede) {
        setForm({
            id: rede.id,
            nome: rede.nome,
            categoria: rede.categoria || '',
            descricao: rede.descricao,
            detalhes: rede.detalhes || '',
            site: rede.site || '',
            telefone: rede.telefone || '',
            imagem: rede.imagem || ''
        });
        setErroForm('');
        setFormAberto(true);
    }

    function fecharForm() {
        setForm(formularioVazio);
        setErroForm('');
        setFormAberto(false);
    }

    function mudarCampo(event) {
        const { name, value } = event.target;
        setForm((atual) => ({ ...atual, [name]: value }));
    }

    async function selecionarImagem(event) {
        const arquivo = event.target.files?.[0];
        event.target.value = '';

        if (!arquivo) return;

        if (!TIPOS_ACEITOS.includes(arquivo.type)) {
            setErroForm('Envie uma imagem PNG, JPEG ou WebP.');
            return;
        }

        if (arquivo.size > MAX_IMAGEM_BYTES) {
            setErroForm('A imagem deve ter no máximo 2 MB.');
            return;
        }

        try {
            const dataUrl = await lerArquivoComoDataUrl(arquivo);
            setForm((atual) => ({ ...atual, imagem: dataUrl }));
            setErroForm('');
        } catch (error) {
            setErroForm(error.message || 'Não foi possível ler a imagem.');
        }
    }

    async function salvar(event) {
        event.preventDefault();

        const nome = form.nome.trim();
        const categoria = form.categoria.trim();
        const descricao = form.descricao.trim();
        const detalhes = form.detalhes.trim();
        const site = form.site.trim();
        const telefone = form.telefone.trim();

        if (!nome) {
            setErroForm('Informe o nome da rede de apoio.');
            return;
        }

        if (categoria.length > MAX_CARACTERES_CATEGORIA) {
            setErroForm(
                `A categoria deve ter no máximo ${MAX_CARACTERES_CATEGORIA} caracteres.`
            );
            return;
        }

        if (!descricao) {
            setErroForm('Informe uma breve descrição.');
            return;
        }

        if (contarPalavras(descricao) > MAX_PALAVRAS_DESCRICAO) {
            setErroForm(
                `A descrição deve ter no máximo ${MAX_PALAVRAS_DESCRICAO} palavras.`
            );
            return;
        }

        if (detalhes.length > MAX_CARACTERES_DETALHES) {
            setErroForm(
                `Os detalhes devem ter no máximo ${MAX_CARACTERES_DETALHES} caracteres.`
            );
            return;
        }

        if (site && !siteSeguro(site)) {
            setErroForm('Informe um site válido começando com http:// ou https://.');
            return;
        }

        if (telefone.length > MAX_CARACTERES_TELEFONE) {
            setErroForm(
                `O telefone deve ter no máximo ${MAX_CARACTERES_TELEFONE} caracteres.`
            );
            return;
        }

        if (telefone && !/^[0-9+()\s.-]+$/.test(telefone)) {
            setErroForm(
                'Informe um telefone válido, usando apenas números e os símbolos + ( ) - .'
            );
            return;
        }

        const editando = Boolean(form.id);
        setSalvando(true);
        setErroForm('');

        try {
            const dados = {
                nome,
                categoria: categoria || null,
                descricao,
                detalhes: detalhes || null,
                site: site || null,
                telefone: telefone || null,
                imagem: form.imagem || null
            };

            if (editando) {
                await supportNetworkService.update(form.id, dados);
            } else {
                await supportNetworkService.create(dados);
            }

            await carregar();
            fecharForm();
            setAviso({
                texto: editando
                    ? 'Rede de apoio atualizada.'
                    : 'Rede de apoio cadastrada.'
            });
        } catch (error) {
            setErroForm(
                error.message || 'Não foi possível salvar a rede de apoio.'
            );
        } finally {
            setSalvando(false);
        }
    }

    async function excluir(rede) {
        const confirmado = window.confirm(
            `Excluir a rede de apoio "${rede.nome}"? Essa ação não pode ser desfeita.`
        );

        if (!confirmado) return;

        setAviso(null);

        try {
            await supportNetworkService.remove(rede.id);
            setRedes((atual) => atual.filter((item) => item.id !== rede.id));
            setAviso({ texto: 'Rede de apoio excluída.' });
        } catch (error) {
            setAviso({
                texto: error.message || 'Não foi possível excluir a rede.',
                erro: true
            });
        }
    }

    const palavras = contarPalavras(form.descricao);

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <header className={`${card} flex flex-col gap-4 sm:flex-row sm:items-center`}>
                <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                        <FontAwesomeIcon icon={faHandHoldingHeart} className="text-xl" />
                    </span>

                    <div>
                        <h1 className="font-serif text-2xl text-[#2e1065]">
                            Redes de Apoio
                        </h1>
                        <p className="text-sm text-gray-600">
                            Cards exibidos na página pública /apoio.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:ml-auto">
                    <button type="button" onClick={carregar} className={botaoSecundario}>
                        <FontAwesomeIcon icon={faRotate} />
                        Atualizar
                    </button>

                    <button type="button" onClick={abrirNova} className={botaoPrimario}>
                        <FontAwesomeIcon icon={faPlus} />
                        Nova rede
                    </button>
                </div>
            </header>

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

            {formAberto && (
                <form onSubmit={salvar} className={`${card} space-y-5`}>
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="font-serif text-lg text-[#2e1065]">
                            {form.id ? 'Editar rede de apoio' : 'Nova rede de apoio'}
                        </h2>

                        <button
                            type="button"
                            onClick={fecharForm}
                            aria-label="Fechar formulário"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-[#5b21b6] transition hover:bg-violet-100"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="rede-nome" className="mb-1 block text-sm font-semibold text-[#2e1065]">
                                    Nome <span className="text-pink-600">*</span>
                                </label>
                                <input
                                    id="rede-nome"
                                    name="nome"
                                    type="text"
                                    value={form.nome}
                                    onChange={mudarCampo}
                                    maxLength={MAX_CARACTERES_NOME}
                                    required
                                    placeholder="Ex.: Casa da Mulher Brasileira"
                                    className={campo}
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label htmlFor="rede-descricao" className="text-sm font-semibold text-[#2e1065]">
                                        Breve descrição <span className="text-pink-600">*</span>
                                    </label>
                                    <span className={`text-xs ${palavras > MAX_PALAVRAS_DESCRICAO ? 'font-semibold text-red-600' : 'text-gray-600'}`}>
                                        {palavras}/{MAX_PALAVRAS_DESCRICAO} palavras
                                    </span>
                                </div>
                                <textarea
                                    id="rede-descricao"
                                    name="descricao"
                                    value={form.descricao}
                                    onChange={mudarCampo}
                                    rows={4}
                                    maxLength={600}
                                    required
                                    placeholder="Explique em poucas palavras o que esse serviço oferece."
                                    className={`${campo} resize-y`}
                                />
                            </div>

                            <div>
                                <label htmlFor="rede-categoria" className="mb-1 block text-sm font-semibold text-[#2e1065]">
                                    Categoria
                                </label>
                                <input
                                    id="rede-categoria"
                                    name="categoria"
                                    type="text"
                                    list="rede-categorias"
                                    value={form.categoria}
                                    onChange={mudarCampo}
                                    maxLength={MAX_CARACTERES_CATEGORIA}
                                    placeholder="Ex.: Segurança e proteção"
                                    className={campo}
                                />
                                <datalist id="rede-categorias">
                                    {CATEGORIAS_REDE.map((categoria) => (
                                        <option key={categoria} value={categoria} />
                                    ))}
                                </datalist>
                                <p className="mt-1 text-xs text-gray-600">
                                    Aparece como etiqueta no card e na página do serviço.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="rede-detalhes" className="mb-1 block text-sm font-semibold text-[#2e1065]">
                                    Como funciona
                                </label>
                                <textarea
                                    id="rede-detalhes"
                                    name="detalhes"
                                    value={form.detalhes}
                                    onChange={mudarCampo}
                                    rows={3}
                                    maxLength={MAX_CARACTERES_DETALHES}
                                    placeholder="Informações extras exibidas na página do serviço."
                                    className={`${campo} resize-y`}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="rede-site" className="mb-1 block text-sm font-semibold text-[#2e1065]">
                                        Site
                                    </label>
                                    <input
                                        id="rede-site"
                                        name="site"
                                        type="url"
                                        value={form.site}
                                        onChange={mudarCampo}
                                        maxLength={MAX_CARACTERES_SITE}
                                        placeholder="https://..."
                                        className={campo}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="rede-telefone" className="mb-1 block text-sm font-semibold text-[#2e1065]">
                                        Telefone
                                    </label>
                                    <input
                                        id="rede-telefone"
                                        name="telefone"
                                        type="tel"
                                        value={form.telefone}
                                        onChange={mudarCampo}
                                        maxLength={MAX_CARACTERES_TELEFONE}
                                        placeholder="Ex.: 180"
                                        className={campo}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 rounded-2xl bg-[#faf5ff] p-4">
                            <p className="text-sm font-semibold text-[#2e1065]">
                                Imagem do card
                            </p>

                            <img
                                src={imagemDaRede(form.imagem)}
                                alt="Prévia da imagem da rede de apoio"
                                className="h-32 w-full rounded-xl border border-violet-100 object-cover"
                            />

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        document.getElementById('rede-imagem').click()
                                    }
                                    className={botaoSecundario}
                                >
                                    <FontAwesomeIcon icon={faUpload} />
                                    Enviar imagem
                                </button>

                                {form.imagem && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((atual) => ({ ...atual, imagem: '' }))
                                        }
                                        className={botaoSecundario}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                        Usar padrão
                                    </button>
                                )}
                            </div>

                            <input
                                id="rede-imagem"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={selecionarImagem}
                                className="hidden"
                            />

                            <p className="text-xs text-gray-600">
                                PNG, JPEG ou WebP, até 2 MB. Sem envio, a imagem padrão é usada.
                            </p>

                            <div>
                                <label htmlFor="rede-imagem-url" className="mb-1 block text-xs font-semibold text-[#2e1065]">
                                    Ou link de imagem externa (API / Unsplash / Web)
                                </label>
                                <input
                                    id="rede-imagem-url"
                                    type="url"
                                    value={form.imagem && form.imagem.startsWith('http') ? form.imagem : ''}
                                    onChange={(e) => setForm((atual) => ({ ...atual, imagem: e.target.value.trim() }))}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    className={campo}
                                />
                            </div>

                            <div>
                                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    <FontAwesomeIcon icon={faImage} />
                                    Imagens prontas
                                </p>

                                <div className="grid grid-cols-2 gap-2">
                                    {IMAGENS_REDES.map((imagem) => {
                                        const selecionada = form.imagem === imagem.src;

                                        return (
                                            <button
                                                key={imagem.id}
                                                type="button"
                                                onClick={() =>
                                                    setForm((atual) => ({
                                                        ...atual,
                                                        imagem: imagem.src
                                                    }))
                                                }
                                                aria-pressed={selecionada}
                                                className={`overflow-hidden rounded-lg border-2 text-left transition ${
                                                    selecionada
                                                        ? 'border-violet-600'
                                                        : 'border-transparent hover:border-violet-300'
                                                }`}
                                            >
                                                <img
                                                    src={imagem.src}
                                                    alt={imagem.nome}
                                                    className="h-14 w-full object-cover"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <p className="text-xs text-gray-600">
                                A primeira arte é usada quando nenhuma imagem é enviada.
                            </p>
                        </div>
                    </div>

                    {erroForm && (
                        <p role="alert" className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
                            {erroForm}
                        </p>
                    )}

                    <div className="flex flex-wrap justify-end gap-2">
                        <button type="button" onClick={fecharForm} className={botaoSecundario}>
                            Cancelar
                        </button>

                        <button type="submit" disabled={salvando} className={botaoPrimario}>
                            <FontAwesomeIcon icon={faCheck} />
                            {salvando ? 'Salvando...' : 'Salvar rede'}
                        </button>
                    </div>
                </form>
            )}

            {carregando ? (
                <p className={`${card} text-sm text-gray-600`}>
                    Carregando redes de apoio...
                </p>
            ) : erro ? (
                <section className={`${card} space-y-3`}>
                    <p role="alert" className="text-sm text-red-700">
                        {erro}
                    </p>
                    <button type="button" onClick={carregar} className={botaoSecundario}>
                        <FontAwesomeIcon icon={faRotate} />
                        Tentar novamente
                    </button>
                </section>
            ) : redes.length === 0 ? (
                <section className={`${card} space-y-3 text-center`}>
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="text-3xl text-pink-500" />
                    <p className="text-sm text-gray-600">
                        Nenhuma rede de apoio cadastrada ainda.
                    </p>
                    <button type="button" onClick={abrirNova} className={botaoPrimario}>
                        <FontAwesomeIcon icon={faPlus} />
                        Cadastrar a primeira
                    </button>
                </section>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {redes.map((rede) => (
                        <article
                            key={rede.id}
                            className="flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm"
                        >
                            <img
                                src={imagemDaRede(rede.imagem)}
                                alt={`Imagem da rede de apoio ${rede.nome}`}
                                className="h-40 w-full object-cover"
                            />

                            <div className="flex flex-1 flex-col p-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-serif text-lg text-[#2e1065]">
                                        {rede.nome}
                                    </h2>

                                    {rede.categoria && (
                                        <span className="rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-pink-700">
                                            {rede.categoria}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                                    {rede.descricao}
                                </p>

                                {(rede.telefone || rede.site) && (
                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-violet-800">
                                        {rede.telefone && (
                                            <a
                                                href={linkTelefone(rede.telefone)}
                                                className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-pink-700"
                                            >
                                                <FontAwesomeIcon icon={faPhone} />
                                                {rede.telefone}
                                            </a>
                                        )}

                                        {rede.site && siteSeguro(rede.site) && (
                                            <a
                                                href={siteSeguro(rede.site)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-pink-700"
                                            >
                                                Site
                                                <span className="sr-only">(abre em nova aba)</span>
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => abrirEdicao(rede)}
                                        className={botaoSecundario}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => excluir(rede)}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
