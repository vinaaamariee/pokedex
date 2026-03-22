import { X } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { STAT_BAR_CLASSES, TYPE_BADGE_CLASSES } from '../constants/pokemonTypeStyles';

interface PokemonDetailProps {
  pokemon: Pokemon | null;
  onClose: () => void;
}

export default function PokemonDetail({ pokemon, onClose }: PokemonDetailProps) {
  if (!pokemon) return null;

  const maxStat = 255;
  const art =
    pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokemon-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/65 transition hover:bg-ink-950/75"
        aria-label="Close detail"
        onClick={onClose}
      />

      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-glass-lg backdrop-blur-2xl dark:border-white/10 dark:bg-ink-900/95">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100/80 bg-white/90 px-5 py-4 backdrop-blur dark:border-white/5 dark:bg-ink-900/90">
          <h2
            id="pokemon-detail-title"
            className="font-display text-2xl font-bold capitalize tracking-tight text-ink-950 dark:text-white"
          >
            {pokemon.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent text-ink-500 transition hover:border-ink-200 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-400 dark:hover:border-white/10 dark:hover:bg-ink-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-4.5rem)] overflow-y-auto p-6 sm:p-8">
          <div className="mb-8 flex flex-col gap-8 md:flex-row md:items-start">
            <div className="relative flex shrink-0 justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100/90 via-white to-cyan-100/80 p-8 dark:from-violet-950/50 dark:via-ink-900/40 dark:to-cyan-950/40 md:w-[240px]">
              <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.25), transparent 55%)',
                }}
              />
              <img src={art} alt={pokemon.name} className="relative z-[1] h-44 w-44 object-contain drop-shadow-2xl sm:h-52 sm:w-52" />
            </div>

            <div className="min-w-0 flex-1 space-y-6">
              <div>
                <span className="font-mono text-4xl font-bold tracking-tight text-violet-600/90 dark:text-cyan-400/90">
                  #{pokemon.id.toString().padStart(3, '0')}
                </span>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types.map((typeInfo) => (
                    <span
                      key={typeInfo.type.name}
                      className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                        TYPE_BADGE_CLASSES[typeInfo.type.name] || TYPE_BADGE_CLASSES.normal
                      }`}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-ink-100/80 bg-ink-50/80 p-4 dark:border-white/5 dark:bg-ink-800/50">
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                    Height
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white">
                    {pokemon.height / 10} m
                  </div>
                </div>
                <div className="rounded-2xl border border-ink-100/80 bg-ink-50/80 p-4 dark:border-white/5 dark:bg-ink-800/50">
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                    Weight
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white">
                    {pokemon.weight / 10} kg
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 font-display text-lg font-bold text-ink-900 dark:text-white">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((abilityInfo) => (
                <div
                  key={abilityInfo.ability.name}
                  className="rounded-2xl border border-violet-200/80 bg-violet-50/80 px-4 py-2.5 dark:border-violet-500/25 dark:bg-violet-950/40"
                >
                  <span className="font-medium capitalize text-violet-900 dark:text-violet-100">
                    {abilityInfo.ability.name.replace('-', ' ')}
                  </span>
                  {abilityInfo.is_hidden && (
                    <span className="ml-2 rounded-md bg-violet-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800 dark:bg-violet-500/30 dark:text-violet-200">
                      Hidden
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-bold text-ink-900 dark:text-white">Base stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((statInfo) => (
                <div key={statInfo.stat.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium capitalize text-ink-600 dark:text-ink-300">
                      {statInfo.stat.name.replace('-', ' ')}
                    </span>
                    <span className="tabular-nums font-bold text-ink-900 dark:text-white">
                      {statInfo.base_stat}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-ink-200/80 dark:bg-ink-700/80">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        STAT_BAR_CLASSES[statInfo.stat.name] || 'bg-gradient-to-r from-slate-400 to-slate-600'
                      }`}
                      style={{ width: `${(statInfo.base_stat / maxStat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-ink-100/80 bg-gradient-to-r from-violet-50/90 to-cyan-50/80 px-5 py-4 dark:border-white/5 dark:from-violet-950/40 dark:to-cyan-950/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink-700 dark:text-ink-200">Total</span>
                <span className="font-display text-2xl font-extrabold tabular-nums text-ink-950 dark:text-white">
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
