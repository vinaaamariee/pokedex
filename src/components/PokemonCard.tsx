import { useState } from 'react';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
  isSelected: boolean;
}

const TYPE_COLORS: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export default function PokemonCard({ pokemon, onSelect, isSelected }: PokemonCardProps) {
  const [zoomed, setZoomed] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't trigger card selection
    setZoomed((prev) => !prev);
  };

  return (
    <div
      onClick={() => onSelect(pokemon)}
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer
        transition-all transform hover:scale-105 hover:shadow-xl
        ${isSelected ? 'ring-4 ring-blue-500 shadow-2xl scale-105' : ''}
      `}
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 flex justify-center items-center h-48">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          onClick={handleImageClick}
          style={{
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: zoomed ? 'scale(1.75)' : 'scale(1)',
            cursor: 'zoom-in',
          }}
          className="w-32 h-32 object-contain drop-shadow-lg"
        />
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">#{pokemon.id.toString().padStart(3, '0')}</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white capitalize mb-2">{pokemon.name}</h3>
        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map((typeInfo) => (
            <span
              key={typeInfo.type.name}
              className={`
                ${TYPE_COLORS[typeInfo.type.name] || 'bg-gray-400'}
                text-white text-xs font-semibold px-3 py-1 rounded-full capitalize
              `}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
