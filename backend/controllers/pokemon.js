const axios = require('axios');
const router = require('express').Router();
const config = require('../utils/config');
const { formatPokemon, formatPokemonList } = require('../models/pkmn');

router.get('/:id', (req, res, next) => {
  const getPokemonData = async () => {
    const pokemon = await axios.get(
      `${config.API_URL}/pokemon/${req.params.id}`
    );
    const pokemonSpecies = await axios.get(
      `${config.API_URL}/pokemon-species/${req.params.id}`
    );
    return { pokemon, pokemonSpecies };
  };

  getPokemonData()
    .then((response) => {
      res.json(
        formatPokemon(response.pokemon.data, response.pokemonSpecies.data)
      );
    })
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {
  const getPokemonList = async () => {
    const pokemonList = await axios.get(
      `${config.API_URL}/pokemon-species/?limit=2000`
    );
    return pokemonList;
  };

  getPokemonList()
    .then((response) => {
      res.json(formatPokemonList(response.data));
    })
    .catch((error) => next(error));
});

module.exports = router;
