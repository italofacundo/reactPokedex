const capitalizeStr = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const stringifyId = (id) => {
  let formattedId = id;
  while (formattedId.toString().length < 3) {
    formattedId = `0${formattedId}`;
  }
  return `#${formattedId}`;
};

const formatPokemon = (pokemon, pokemonSpecies) => {
  const formattedPokemon = {
    name: capitalizeStr(pokemon.forms[0].name),
    number: stringifyId(pokemon.id),
    description: pokemonSpecies.genera.find((obj) => obj.language.name === 'en')
      .genus,
    types: [
      ...pokemon.types.map((pkmnType) => capitalizeStr(pkmnType.type.name)),
    ],
    sprite:
      pokemon.sprites.versions['generation-v']['black-white'].animated
        .front_default || pokemon.sprites.front_default,
  };

  return formattedPokemon;
};

const formatPokemonList = (pokemonList) => {
  const formattedPokemonList = pokemonList.results.map((pokemon, index) => ({
    name: pokemon.name,
    number: index + 1,
  }));

  return formattedPokemonList;
};

module.exports = { formatPokemon, formatPokemonList };
