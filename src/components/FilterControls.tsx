import { Filter } from 'lucide-react';

interface FilterControlsProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const POKEMON_TYPES = [
  'all',
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

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
  all: 'bg-gray-600',
};

export default function FilterControls({ selectedType, onTypeChange }: FilterControlsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-700">Filter by Type</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`
              px-4 py-2 rounded-full text-white font-medium text-sm capitalize
              transition-all transform hover:scale-105
              ${TYPE_COLORS[type] || 'bg-gray-400'}
              ${selectedType === type ? 'ring-4 ring-offset-2 ring-blue-400 shadow-lg' : 'opacity-70 hover:opacity-100'}
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
