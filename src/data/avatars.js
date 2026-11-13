import { Avatar, Style } from '@dicebear/core';

import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };
import loreleiNeutral from '@dicebear/styles/lorelei-neutral.json' with { type: 'json' };
import adventurer from '@dicebear/styles/adventurer.json' with { type: 'json' };
import adventurerNeutral from '@dicebear/styles/adventurer-neutral.json' with { type: 'json' };

// Avatares pré-setados da plataforma.
// O banco guarda apenas o `id`; o SVG é gerado pelo DiceBear no frontend.
// Todos os estilos são da mesma linha de arte do Lorelei (Lisa Wischofsky):
// lorelei, lorelei-neutral, adventurer e adventurer-neutral.
// Os seeds e as cores são fixos para o avatar ser sempre igual para todos.
function createPreset(definition, seed, backgroundColor) {
    const style = new Style(definition);

    return new Avatar(style, {
        seed,
        size: 128,
        backgroundColor: [backgroundColor],
        borderRadius: 50,
    }).toDataUri();
}

export const AVATARS = [
    {
        id: 'avatar-1',
        label: 'Lore',
        style: 'lorelei',
        src: createPreset(lorelei, 'ella-lore', 'ffd6e7'),
    },
    {
        id: 'avatar-2',
        label: 'Lore II',
        style: 'lorelei',
        src: createPreset(lorelei, 'ella-lore-2', 'e9d5ff'),
    },
    {
        id: 'avatar-3',
        label: 'Lore clara',
        style: 'lorelei-neutral',
        src: createPreset(loreleiNeutral, 'ella-lore-clara', 'fde68a'),
    },
    {
        id: 'avatar-4',
        label: 'Lore clara II',
        style: 'lorelei-neutral',
        src: createPreset(loreleiNeutral, 'ella-lore-clara-2', 'c7d2fe'),
    },
    {
        id: 'avatar-5',
        label: 'Aventureira',
        style: 'adventurer',
        src: createPreset(adventurer, 'ella-aventura', 'bbf7d0'),
    },
    {
        id: 'avatar-6',
        label: 'Aventureira II',
        style: 'adventurer',
        src: createPreset(adventurer, 'ella-aventura-2', 'bae6fd'),
    },
    {
        id: 'avatar-7',
        label: 'Aventureira clara',
        style: 'adventurer-neutral',
        src: createPreset(adventurerNeutral, 'ella-aventura-clara', 'fbcfe8'),
    },
    {
        id: 'avatar-8',
        label: 'Aventureira clara II',
        style: 'adventurer-neutral',
        src: createPreset(adventurerNeutral, 'ella-aventura-clara-2', 'ddd6fe'),
    },
];

export const DEFAULT_AVATAR = AVATARS[0].id;

export function getAvatarById(id) {
    return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}
