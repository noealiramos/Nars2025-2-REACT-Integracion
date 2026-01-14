import { useEffect, useState } from "react";

const Pokedex = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // [] vacío = se ejecuta una sola vez al montar
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data.results);
      })
      .catch((error) => {
        console.error("Error al cargar Pokémon:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Pokedex Minimalista</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {pokemons.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Pokedex;
