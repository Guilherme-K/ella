import { AVATARS } from '../data/avatars';
import Avatar from './Avatar';

// Grade com os avatares pré-setados. Quem usa o componente decide o que
// fazer quando uma opção é escolhida (normalmente um PATCH /api/users/me).
function AvatarPicker({ value, onChange, disabled = false }) {
    return (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {AVATARS.map((avatar) => {
                const selecionado = avatar.id === value;

                return (
                    <button
                        key={avatar.id}
                        type="button"
                        onClick={() => onChange?.(avatar.id)}
                        disabled={disabled}
                        aria-label={`Usar avatar ${avatar.label}`}
                        aria-pressed={selecionado}
                        title={avatar.label}
                        className={`flex flex-col items-center gap-1 rounded-2xl border p-2 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            selecionado
                                ? 'border-pink-400 bg-pink-50 ring-2 ring-pink-200'
                                : 'border-violet-100 bg-white hover:border-pink-200 hover:bg-pink-50'
                        }`}
                    >
                        <Avatar
                            nome={avatar.label}
                            avatar={avatar.id}
                            tamanho="h-12 w-12 text-xl"
                        />
                        <span className="text-[0.65rem] text-[#5b21b6]">
                            {avatar.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

export default AvatarPicker;
