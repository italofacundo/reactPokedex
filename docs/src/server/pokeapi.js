import axios from 'axios';

const baseUrl = 'https://react-pokedex-backend.herokuapp.com/api/pokemon';

const getPokemon = (id) => axios.get(`${baseUrl}/${id}`);

export default getPokemon;
export const getPokemonList = () => axios.get(baseUrl);
