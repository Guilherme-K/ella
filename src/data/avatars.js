import { Avatar, Style } from '@dicebear/core';

import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };
import bigSmile from '@dicebear/styles/big-smile.json' with { type: 'json' };
import micah from '@dicebear/styles/micah.json' with { type: 'json' };
import personas from '@dicebear/styles/personas.json' with { type: 'json' };
import miniavs from '@dicebear/styles/miniavs.json' with { type: 'json' };
import dylan from '@dicebear/styles/dylan.json' with { type: 'json' };
import funEmoji from '@dicebear/styles/fun-emoji.json' with { type: 'json' };
import pixelArt from '@dicebear/styles/pixel-art-neutral.json' with { type: 'json' };

// Avatares pré-setados da plataforma.
// O banco guarda apenas o `id`; o SVG é gerado pelo DiceBear no frontend.
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
    label: 'Sorriso',
    style: 'big-smile',
    src: createPreset(bigSmile, 'ella-sorriso', 'e9d5ff'),
  },
  {
    id: 'avatar-3',
    label: 'Micah',
    style: 'micah',
    src: createPreset(micah, 'ella-micah', 'fde68a'),
  },
  {
    id: 'avatar-4',
    label: 'Persona',
    style: 'personas',
    src: createPreset(personas, 'ella-persona', 'c7d2fe'),
  },
  {
    id: 'avatar-5',
    label: 'Mini',
    style: 'miniavs',
    src: createPreset(miniavs, 'ella-mini', 'bbf7d0'),
  },
  {
    id: 'avatar-6',
    label: 'Dylan',
    style: 'dylan',
    src: createPreset(dylan, 'ella-dylan', 'bae6fd'),
  },
  {
    id: 'avatar-7',
    label: 'Divertida',
    style: 'fun-emoji',
    src: createPreset(funEmoji, 'ella-divertida', 'fbcfe8'),
  },
  {
    id: 'avatar-8',
    label: 'Pixel',
    style: 'pixel-art-neutral',
    src: createPreset(pixelArt, 'ella-pixel', 'ddd6fe'),
  },
];

export const DEFAULT_AVATAR = AVATARS[0].id;

export function getAvatarById(id) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}
