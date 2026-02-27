import { Pokemon, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit: number = 151): Promise<Pokemon[]> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    const data: PokemonListResponse = await response.json();

    const pokemonPromises = data.results.map((item) =>
      fetchPokemonDetails(item.url)
    );

    const pokemonList = await Promise.all(pokemonPromises);
    return pokemonList;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export async function fetchPokemonDetails(url: string): Promise<Pokemon> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon details');
    }
    const pokemon: Pokemon = await response.json();
    return pokemon;
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
    throw error;
  }
}

export async function fetchPokemonByName(name: string): Promise<Pokemon | null> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
    if (!response.ok) {
      return null;
    }
    const pokemon: Pokemon = await response.json();
    return pokemon;
  } catch (error) {
    console.error('Error fetching Pokemon by name:', error);
    return null;
  }
}
