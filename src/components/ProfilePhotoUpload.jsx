import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import Avatar from './Avatar';

const MAX_BYTES = 2 * 1024 * 1024;
const TIPOS_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'];

function lerArquivoComoDataUrl(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = () => resolve(String(leitor.result));
        leitor.onerror = () =>
            reject(new Error('Não foi possível ler a imagem.'));
        leitor.readAsDataURL(arquivo);
    });
}

// Upload da foto de perfil. A imagem é convertida em data URL e enviada para
// PATCH /api/users/me; o backend valida o formato e o tamanho antes de salvar.
function ProfilePhotoUpload({
    nome = '',
    avatar,
    photo,
    onUpload,
    onRemove,
    disabled = false,
}) {
    const inputRef = useRef(null);
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function selecionar(event) {
        const arquivo = event.target.files?.[0];

        // Permite escolher o mesmo arquivo novamente depois.
        event.target.value = '';
        if (!arquivo) return;

        setErro('');

        if (!TIPOS_ACEITOS.includes(arquivo.type)) {
            setErro('Escolha uma imagem PNG, JPEG ou WebP.');
            return;
        }

        if (arquivo.size > MAX_BYTES) {
            setErro('A imagem deve ter no máximo 2 MB.');
            return;
        }

        setEnviando(true);

        try {
            const dataUrl = await lerArquivoComoDataUrl(arquivo);
            await onUpload?.(dataUrl);
        } catch (error) {
            setErro(error.message || 'Não foi possível enviar a foto.');
        } finally {
            setEnviando(false);
        }
    }

    async function remover() {
        setErro('');
        setEnviando(true);

        try {
            await onRemove?.();
        } catch (error) {
            setErro(error.message || 'Não foi possível remover a foto.');
        } finally {
            setEnviando(false);
        }
    }

    const ocupado = disabled || enviando;

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar
                nome={nome}
                avatar={avatar}
                photo={photo}
                tamanho="h-20 w-20 text-2xl"
            />

            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={ocupado}
                        className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FontAwesomeIcon icon={faCamera} className="mr-2" />
                        {enviando
                            ? 'Enviando...'
                            : photo
                              ? 'Trocar foto'
                              : 'Enviar foto'}
                    </button>

                    {photo && (
                        <button
                            type="button"
                            onClick={remover}
                            disabled={ocupado}
                            className="rounded-full border border-violet-200 px-4 py-2 text-sm text-[#5b21b6] transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FontAwesomeIcon
                                icon={faTrashCan}
                                className="mr-2"
                            />
                            Remover foto
                        </button>
                    )}
                </div>

                <p className="text-xs text-gray-400">
                    PNG, JPEG ou WebP, até 2 MB. A foto substitui o avatar
                    escolhido.
                </p>

                {erro && (
                    <p role="alert" className="text-xs text-red-600">
                        {erro}
                    </p>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={selecionar}
                className="hidden"
            />
        </div>
    );
}

export default ProfilePhotoUpload;
