import { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, LayoutGrid, Camera } from 'lucide-react';
import { Pokemon } from './types/pokemon';
import { fetchPokemonList } from './services/pokemonApi';
import SearchBar from './components/SearchBar';
import FilterControls from './components/FilterControls';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import PhotoEditor from './components/PhotoEditor';

type AppView = 'pokedex' | 'studio';

function App() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [view, setView] = useState<AppView>('pokedex');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        const pokemon = await fetchPokemonList(151);
        setAllPokemon(pokemon);
      } catch (error) {
        console.error('Failed to load Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, []);

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === 'all' ||
        pokemon.types.some((typeInfo) => typeInfo.type.name === selectedType);

      return matchesSearch && matchesType;
    });
  }, [allPokemon, searchTerm, selectedType]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark transition-colors duration-500">
      <div className="relative min-h-screen">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.35] dark:opacity-[0.2]"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative container mx-auto max-w-7xl px-4 py-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-10 lg:px-8">
          <header className="mb-6 text-center sm:mb-10">
            <div className="relative mx-auto mb-6 max-w-3xl px-12 sm:mb-8 sm:px-14">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
                className="absolute right-0 top-0 z-10 flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-ink-600 shadow-glass backdrop-blur-md transition hover:border-violet-300/80 hover:bg-white hover:text-violet-700 dark:border-white/10 dark:bg-ink-900/60 dark:text-ink-200 dark:hover:border-violet-500/40 dark:hover:bg-ink-800 dark:hover:text-violet-300"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-600/90 dark:text-cyan-300/90 sm:mb-3 sm:text-xs sm:tracking-[0.25em]">
                Kanto archive
              </p>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-950 dark:text-white sm:text-5xl md:text-6xl">
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent dark:from-violet-300 dark:via-fuchsia-300 dark:to-cyan-300">
                  Pokédex
                </span>
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-ink-600 dark:text-ink-300 sm:mt-4 sm:text-base lg:text-lg">
                {view === 'pokedex'
                  ? 'Browse all 151 originals — crisp art, types, and stats in one calm place.'
                  : 'Drop in a photo, layer official artwork stickers, and export a share-ready PNG.'}
              </p>
            </div>

            <nav
              className="mx-auto flex w-full max-w-md flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/70 bg-white/60 p-1.5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/50 sm:gap-2"
              aria-label="Main navigation"
            >
              <button
                type="button"
                onClick={() => setView('pokedex')}
                className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:min-h-0 sm:flex-initial sm:px-6 ${
                  view === 'pokedex'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/35'
                    : 'text-ink-600 hover:bg-white/80 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800/80 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="h-4 w-4 opacity-90" />
                Pokédex
              </button>
              <button
                type="button"
                onClick={() => setView('studio')}
                className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:min-h-0 sm:flex-initial sm:px-6 ${
                  view === 'studio'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/35'
                    : 'text-ink-600 hover:bg-white/80 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800/80 dark:hover:text-white'
                }`}
              >
                <Camera className="h-4 w-4 opacity-90" />
                Photo Studio
              </button>
            </nav>
          </header>

          {view === 'pokedex' && (
            <>
              <div className="mb-10 space-y-8">
                <div className="flex justify-center">
                  <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                </div>

                <FilterControls selectedType={selectedType} onTypeChange={handleTypeChange} />
              </div>

              <div className="mb-6 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-ink-700 shadow-sm backdrop-blur dark:border-violet-500/20 dark:bg-ink-900/60 dark:text-ink-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="font-semibold tabular-nums text-violet-700 dark:text-violet-300">
                    {filteredPokemon.length}
                  </span>
                  <span className="text-ink-500 dark:text-ink-400">Pokémon match</span>
                </span>
              </div>

              <PokemonList
                pokemon={filteredPokemon}
                onSelectPokemon={handleSelectPokemon}
                selectedPokemon={selectedPokemon}
                loading={loading}
              />

              <PokemonDetail pokemon={selectedPokemon} onClose={handleCloseDetail} />
            </>
          )}

          {view === 'studio' && <PhotoEditor pokemon={allPokemon} loading={loading} />}
        </div>
      </div>
    </div>
  );
}

export default App;
