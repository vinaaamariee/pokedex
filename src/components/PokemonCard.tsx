import { useState } from 'react';
import { Pokemon } from '../types/pokemon';
import { TYPE_BADGE_CLASSES } from '../constants/pokemonTypeStyles';

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
  isSelected: boolean;
}

export default function PokemonCard({ pokemon, onSelect, isSelected }: PokemonCardProps) {
  const [zoomed, setZoomed] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomed((prev) => !prev);
  };

  const art =
    pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <button
      type="button"
      onClick={() => onSelect(pokemon)}
      className={`
        group relative w-full overflow-hidden rounded-3xl border text-left transition-all duration-300
        border-white/70 bg-white/75 shadow-glass backdrop-blur-md
        hover:-translate-y-1 hover:shadow-glass-lg dark:border-white/10 dark:bg-ink-900/55
        ${isSelected ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-transparent dark:ring-cyan-400 dark:ring-offset-ink-950' : ''}
      `}
    >
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50/90 via-white to-cyan-50/80 dark:from-violet-950/40 dark:via-ink-900/30 dark:to-cyan-950/30">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.2), transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.15), transparent 45%)',
          }}
        />
        <img
          src={art}
          alt={pokemon.name}
          onClick={handleImageClick}
          style={{
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: zoomed ? 'scale(1.65)' : 'scale(1)',
            cursor: 'zoom-in',
          }}
          className="relative z-[1] h-36 w-36 object-contain drop-shadow-xl"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-violet-600/80 dark:text-cyan-400/80">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>
        <h3 className="font-display text-xl font-bold capitalize tracking-tight text-ink-900 dark:text-white">
          {pokemon.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {pokemon.types.map((typeInfo) => (
            <span
              key={typeInfo.type.name}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                TYPE_BADGE_CLASSES[typeInfo.type.name] || TYPE_BADGE_CLASSES.normal
              }`}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
