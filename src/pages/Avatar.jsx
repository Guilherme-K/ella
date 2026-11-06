import { useState } from 'react'

function Avatar({ nome = 'Usuária', src, avatar, tamanho = 'h-10 w-10', online = false, className = '' }) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = (!imageError && (src || avatar)) ? (src || avatar) : null

  const iniciais = (nome || 'U')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('') || 'U'

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white shadow-inner select-none ${tamanho} ${className} ${
        !imageUrl ? 'bg-gradient-to-br from-pink-400 via-purple-400 to-violet-600' : 'bg-purple-100'
      }`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={nome || 'Avatar'}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-xs uppercase tracking-wider">{iniciais}</span>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
      )}
    </span>
  )
}

export default Avatar
