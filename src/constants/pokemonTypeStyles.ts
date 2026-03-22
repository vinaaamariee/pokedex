/** Tailwind class bundles for Pokémon type chips (shared across cards, filters, detail). */
export const TYPE_BADGE_CLASSES: Record<string, string> = {
  normal: 'bg-slate-400/95 text-white shadow-inner shadow-white/20',
  fire: 'bg-gradient-to-br from-orange-400 to-rose-600 text-white shadow-lg shadow-orange-500/30',
  water: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/25',
  electric: 'bg-gradient-to-br from-amber-300 to-yellow-500 text-amber-950 shadow-lg shadow-amber-400/40',
  grass: 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/25',
  ice: 'bg-gradient-to-br from-cyan-300 to-sky-500 text-cyan-950 shadow-lg shadow-cyan-400/30',
  fighting: 'bg-gradient-to-br from-red-600 to-rose-800 text-white shadow-lg shadow-red-600/30',
  poison: 'bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30',
  ground: 'bg-gradient-to-br from-amber-600 to-orange-800 text-amber-50 shadow-lg shadow-amber-700/25',
  flying: 'bg-gradient-to-br from-indigo-300 to-violet-400 text-indigo-950 shadow-lg shadow-indigo-400/25',
  psychic: 'bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white shadow-lg shadow-pink-500/30',
  bug: 'bg-gradient-to-br from-lime-400 to-emerald-600 text-lime-950 shadow-lg shadow-lime-500/20',
  rock: 'bg-gradient-to-br from-stone-500 to-amber-900 text-amber-50 shadow-lg shadow-stone-600/25',
  ghost: 'bg-gradient-to-br from-purple-600 to-indigo-800 text-white shadow-lg shadow-purple-600/30',
  dragon: 'bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/35',
  dark: 'bg-gradient-to-br from-slate-700 to-slate-900 text-slate-100 shadow-lg shadow-slate-900/40',
  steel: 'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-lg shadow-slate-500/25',
  fairy: 'bg-gradient-to-br from-pink-300 to-rose-400 text-rose-950 shadow-lg shadow-pink-400/30',
  all: 'bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-lg shadow-slate-600/25',
};

export const STAT_BAR_CLASSES: Record<string, string> = {
  hp: 'bg-gradient-to-r from-rose-400 to-red-500',
  attack: 'bg-gradient-to-r from-orange-400 to-amber-500',
  defense: 'bg-gradient-to-r from-amber-400 to-yellow-500',
  'special-attack': 'bg-gradient-to-r from-sky-400 to-indigo-500',
  'special-defense': 'bg-gradient-to-r from-emerald-400 to-teal-500',
  speed: 'bg-gradient-to-r from-fuchsia-400 to-pink-500',
};
