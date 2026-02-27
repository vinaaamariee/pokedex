import { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';

interface PokemonListProps {
  pokemon: Pokemon[];
  onSelectPokemon: (pokemon: Pokemon) => void;
  selectedPokemon: Pokemon | null;
  loading: boolean;
}

export default function PokemonList({
  pokemon,
  onSelectPokemon,
  selectedPokemon,
  loading,
}: PokemonListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-500 dark:text-gray-400">
        <p className="text-xl font-semibold mb-2">No Pokémon found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pokemon.map((poke) => (
        <PokemonCard
          key={poke.id}
          pokemon={poke}
          onSelect={onSelectPokemon}
          isSelected={selectedPokemon?.id === poke.id}
        />
      ))}
    </div>
  );
}
