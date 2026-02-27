import { X } from 'lucide-react';
import { Pokemon } from '../types/pokemon';

interface PokemonDetailProps {
  pokemon: Pokemon | null;
  onClose: () => void;
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

const STAT_COLORS: { [key: string]: string } = {
  hp: 'bg-red-500',
  attack: 'bg-orange-500',
  defense: 'bg-yellow-500',
  'special-attack': 'bg-blue-500',
  'special-defense': 'bg-green-500',
  speed: 'bg-pink-500',
};

export default function PokemonDetail({ pokemon, onClose }: PokemonDetailProps) {
  if (!pokemon) return null;

  const maxStat = 255;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">{pokemon.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 flex justify-center items-center">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-48 h-48 object-contain drop-shadow-2xl"
              />
            </div>

            <div className="flex-grow">
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Type</h3>
                <div className="flex gap-2 flex-wrap">
                  {pokemon.types.map((typeInfo) => (
                    <span
                      key={typeInfo.type.name}
                      className={`
                        ${TYPE_COLORS[typeInfo.type.name] || 'bg-gray-400'}
                        text-white text-sm font-semibold px-4 py-2 rounded-full capitalize
                      `}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Height</div>
                  <div className="text-xl font-bold text-gray-800 dark:text-white">{pokemon.height / 10} m</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Weight</div>
                  <div className="text-xl font-bold text-gray-800 dark:text-white">{pokemon.weight / 10} kg</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((abilityInfo) => (
                <div
                  key={abilityInfo.ability.name}
                  className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700"
                >
                  <span className="capitalize font-medium">
                    {abilityInfo.ability.name.replace('-', ' ')}
                  </span>
                  {abilityInfo.is_hidden && (
                    <span className="ml-2 text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">Hidden</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Base Stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((statInfo) => (
                <div key={statInfo.stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 capitalize">
                      {statInfo.stat.name.replace('-', ' ')}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{statInfo.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${STAT_COLORS[statInfo.stat.name] || 'bg-gray-500'} transition-all duration-500 rounded-full`}
                      style={{ width: `${(statInfo.base_stat / maxStat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Total</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
