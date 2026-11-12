// Avatares pré-setados da plataforma.
// O banco guarda apenas o `id`; o desenho é feito no frontend.
export const AVATARS = [
  {
    id: 'avatar-1',
    label: 'Flor',
    emoji: '🌸',
    classes: 'from-pink-300 to-rose-400',
  },
  {
    id: 'avatar-2',
    label: 'Borboleta',
    emoji: '🦋',
    classes: 'from-violet-300 to-purple-500',
  },
  {
    id: 'avatar-3',
    label: 'Girassol',
    emoji: '🌻',
    classes: 'from-amber-300 to-orange-400',
  },
  {
    id: 'avatar-4',
    label: 'Lua',
    emoji: '🌙',
    classes: 'from-indigo-300 to-violet-500',
  },
  {
    id: 'avatar-5',
    label: 'Estrela',
    emoji: '⭐',
    classes: 'from-yellow-300 to-amber-500',
  },
  {
    id: 'avatar-6',
    label: 'Pomba',
    emoji: '🕊️',
    classes: 'from-sky-300 to-cyan-500',
  },
  {
    id: 'avatar-7',
    label: 'Tulipa',
    emoji: '🌷',
    classes: 'from-rose-300 to-pink-500',
  },
  {
    id: 'avatar-8',
    label: 'Lavanda',
    emoji: '🪻',
    classes: 'from-fuchsia-300 to-violet-500',
  },
];

export const DEFAULT_AVATAR = AVATARS[0].id;

export function getAvatarById(id) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}
