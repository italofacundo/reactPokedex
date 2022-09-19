import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import getPokemon, { getPokemonList } from './server/pokeapi';

function MainPage() {
  return (
    <div className="main-content">
      <Header />
      <Pokedex />
    </div>
  );
}

function Header() {
  return (
    <header className="main-header">
      <a href="#">
        <img
          src="assets/pokemon_logo.png"
          alt="The Pokémon Company Logo"
          className="poke-company-logo"
        />
      </a>
      <nav className="main-nav">
        <ul className="nav-list">
          <li>
            <a href="#">Pokédex</a>
          </li>
          <li className="nav-list-separator" />
          <li>
            <a href="#">About Us</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Pokedex() {
  const [search, setSearch] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonFilter, setPokemonFilter] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      setPokemonList((await getPokemonList()).data);
    };

    fetchPokemonList().catch(console.error);
  }, []);

  useEffect(() => {
    const filteredPokemon = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
    setPokemonFilter(filteredPokemon);
  }, [search, pokemonList]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  return (
    <>
      <BackgroundImage />
      <SearchBar handleSearch={handleSearch} search={search} />
      <ToggleRegion />
      <PokemonView pokemonFilter={pokemonFilter} search={search} />
    </>
  );
}

function BackgroundImage() {
  return (
    <>
      <div className="pokedex-bg-container">
        <img
          src="assets/firered_intro.gif"
          alt=""
          className="pokedex-bg-invisible"
        />
        <h1>Pokédex</h1>
      </div>
      <div className="pokedex-bg-border" />
    </>
  );
}

function SearchBar({ handleSearch, search }) {
  return (
    <div className="pokemon-search">
      <form className="pokemon-search-form">
        <input
          type="text"
          placeholder="Search Pokémon name..."
          className="pokemon-search-form-box"
          onChange={handleSearch}
          value={search}
        />
      </form>
    </div>
  );
}

function ToggleRegion() {
  return (
    <nav className="region-nav">
      <ul className="region-nav-list">
        <a href="#">
          <li>Kanto</li>
        </a>
        <a href="#">
          <li>Johto</li>
        </a>
        <a href="#">
          <li>Hoenn</li>
        </a>
        <a href="#">
          <li>Sinnoh</li>
        </a>
        <a href="#">
          <li>Unova</li>
        </a>
        <a href="#">
          <li>Kalos</li>
        </a>
        <a href="#">
          <li>Alola</li>
        </a>
        <a href="#">
          <li>Galar</li>
        </a>
      </ul>
    </nav>
  );
}

function PokemonView({ pokemonFilter, search }) {
  const [pokemonIds, setPokemonIds] = useState([]);
  const prevPokemonIds = usePrevious(pokemonIds);
  const [pokemonRequests, setPokemonRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [resetPageNumber, setResetPageNumber] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const observer = useRef(null);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const pokemonPerPage = 20;

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 76) setPageNumber(pageNumber + 1);
  });

  useEffect(() => {
    setResetPageNumber(true);
  }, [pokemonFilter]);

  useEffect(() => {
    if (resetPageNumber) setPageNumber(1);
  }, [resetPageNumber]);

  useEffect(() => {
    setPokemonIds(
      pokemonFilter.map((pokemon, index) =>
        index + 1 <= pageNumber * pokemonPerPage ? pokemon.number : null
      )
    );
  }, [pokemonFilter, pageNumber]);

  useEffect(() => {
    const fetch = async () => {
      const promiseArray = [];

      for (const [index, id] of pokemonIds.entries()) {
        if (id) {
          if (id === prevPokemonIds[index]) {
            promiseArray.push(pokemonRequests[index]);
          } else {
            const promise = getPokemon(id);
            promiseArray.push(promise);
          }
        }
      }

      console.log('Loading data...');
      setIsLoading(true);
      const results = await Promise.all(promiseArray);
      console.log('Data loaded!');
      setIsLoading(false);
      setResetPageNumber(false);
      const resultsData = results.map((result) => {
        if (!result) return;

        if ('data' in result) {
          return result.data;
        }

        return result;
      });
      console.log('.', resultsData);

      setPokemonRequests(resultsData);
    };
    const timeout = setTimeout(fetch, 500);

    return () => clearTimeout(timeout);
  }, [pokemonIds]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setIsVisible(entry.isIntersecting);
      if (isLoading) return;
      if (entry.isIntersecting && pokemonFilter.length > 20) {
        if (document.querySelector('.pokemon-grid').childElementCount >= 20)
          setPageNumber(pageNumber + 1);
      }
    });

    if (observer.current) intersectionObserver.observe(observer.current);

    return () => {
      if (observer.current) intersectionObserver.unobserve(observer.current);
    };
  }, [observer, isLoading, pokemonFilter]);

  return (
    <div className="pokemon-grid-container">
      <ul className="pokemon-grid">
        {pokemonRequests.map((pokemon, index) => (
          <PokemonCard pokemon={pokemon} key={index} />
        ))}
      </ul>
      <div className="loading-animation-container">
        {isLoading ? (
          <img
            className="loading-animation"
            src="./assets/loading_animation.svg"
            alt="Loading"
          />
        ) : null}
      </div>
      <div className="observer" ref={observer} />
    </div>
  );
}

function PokemonCard({ pokemon }) {
  const className = (type) => {
    const typeClass = {
      Fairy: 'type-fairy',
      Steel: 'type-steel',
      Dark: 'type-dark',
      Dragon: 'type-dragon',
      Ghost: 'type-ghost',
      Rock: 'type-rock',
      Bug: 'type-bug',
      Psychic: 'type-psychic',
      Flying: 'type-flying',
      Ground: 'type-ground',
      Poison: 'type-poison',
      Fighting: 'type-fighting',
      Ice: 'type-ice',
      Grass: 'type-grass',
      Electric: 'type-electric',
      Water: 'type-water',
      Fire: 'type-fire',
      Normal: 'type-normal',
    };

    return [
      `pokemon-card ${typeClass[type]}`,
      `pokemon-type ${typeClass[type]}`,
    ];
  };

  if (!Object.keys(pokemon).length) return;
  console.log(pokemon);

  return (
    <li className="pokemon-card-list">
      <div className={className(pokemon.types[0])[0]}>
        <img src={pokemon.sprite} alt={pokemon.name} />
        <div className="bottom-card">
          <p className="pokemon-name">
            {pokemon.name}
            <span className="pokemon-number">{pokemon.number}</span>
          </p>
          <p className="pokemon-description">{pokemon.description}</p>
          <div className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <span className={className(type)[1]} key={index}>
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

function App() {
  return <MainPage />;
}

export default App;
