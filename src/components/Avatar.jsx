import { getAvatarById } from '../data/avatars';

function iniciaisDoNome(nome) {
    return String(nome || '?')
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase();
}

function Avatar({ nome = '', avatar, tamanho = 'h-10 w-10', online = false }) {
    const preset = avatar ? getAvatarById(avatar) : null;

    return (
        <span
            title={preset ? preset.label : nome}
            className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${preset ? preset.classes : 'from-pink-300 to-violet-400'} ${tamanho}`}
        >
            {preset ? (
                <span aria-hidden="true">{preset.emoji}</span>
            ) : (
                iniciaisDoNome(nome)
            )}
            <span className="sr-only">{nome || preset?.label}</span>
            {online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            )}
        </span>
    );
}

export default Avatar;
