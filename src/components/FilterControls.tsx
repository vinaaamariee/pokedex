import { SlidersHorizontal } from 'lucide-react';
import { TYPE_BADGE_CLASSES } from '../constants/pokemonTypeStyles';

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

export default function FilterControls({ selectedType, onTypeChange }: FilterControlsProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-center gap-2 sm:justify-start">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-700 dark:bg-cyan-500/15 dark:text-cyan-300">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-ink-800 dark:text-ink-100">Filter by type</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
        {POKEMON_TYPES.map((type) => {
          const selected = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`
                rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all duration-200
                ${TYPE_BADGE_CLASSES[type] || TYPE_BADGE_CLASSES.normal}
                ${
                  selected
                    ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-white scale-[1.02] dark:ring-cyan-400 dark:ring-offset-ink-950'
                    : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'
                }
              `}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
