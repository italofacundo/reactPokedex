import axios from 'axios';

const baseUrl = '/api/pokemon';

const getPokemon = (id) => axios.get(`${baseUrl}/${id}`);

export default getPokemon;
export const getPokemonList = () => axios.get(baseUrl);
