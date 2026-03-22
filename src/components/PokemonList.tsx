import { Loader2 } from 'lucide-react';
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
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-violet-200/80 dark:border-violet-500/30" />
          <Loader2 className="absolute inset-0 m-auto h-10 w-10 animate-spin text-violet-600 dark:text-cyan-400" />
        </div>
        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Summoning Pokémon…</p>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-violet-300/60 bg-white/50 px-6 py-16 text-center dark:border-violet-500/25 dark:bg-ink-900/40">
        <p className="font-display text-xl font-bold text-ink-800 dark:text-ink-100">No matches</p>
        <p className="mt-2 max-w-sm text-sm text-ink-500 dark:text-ink-400">
          Loosen your search or pick another type — the tall grass is empty for now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pokemon.map((poke) => (
        <div key={poke.id} className="animate-fade-up" style={{ animationDelay: `${(poke.id % 8) * 40}ms` }}>
          <PokemonCard
            pokemon={poke}
            onSelect={onSelectPokemon}
            isSelected={selectedPokemon?.id === poke.id}
          />
        </div>
      ))}
    </div>
  );
}
