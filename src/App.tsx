import { useState, useEffect, useMemo } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Pokemon } from './types/pokemon';
import { fetchPokemonList } from './services/pokemonApi';
import SearchBar from './components/SearchBar';
import FilterControls from './components/FilterControls';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';

function App() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">
          {/* Dark Mode Toggle — top-right corner */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            className="absolute right-0 top-0 p-2 rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight">
            Pokédex
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore and discover all 151 original Pokémon
          </p>
        </header>

        <div className="mb-8 space-y-6">
          <div className="flex justify-center">
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          </div>

          <FilterControls selectedType={selectedType} onTypeChange={handleTypeChange} />
        </div>

        <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
          <span className="font-semibold">{filteredPokemon.length}</span> Pokémon found
        </div>

        <PokemonList
          pokemon={filteredPokemon}
          onSelectPokemon={handleSelectPokemon}
          selectedPokemon={selectedPokemon}
          loading={loading}
        />

        <PokemonDetail pokemon={selectedPokemon} onClose={handleCloseDetail} />
      </div>
    </div>
  );
}

export default App;
