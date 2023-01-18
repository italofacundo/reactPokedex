import axios from 'axios';

const baseUrl = 'https://reactpokedexbackend.onrender.com/api/pokemon';

const getPokemon = (id) => axios.get(`${baseUrl}/${id}`);

export default getPokemon;
export const getPokemonList = () => axios.get(baseUrl);
