const typeColors = {
  Grass: "#78C850",
  Fire: "#F08030",
  Water: "#6890F0",
  Poison: "#A040A0",
  Flying: "#A890F0",
  Bug: "#A8B820",
  Normal: "#A8A878",
  Electric: "#F8D030",
  Ground: "#E0C068",
  Psychic: "#F85888",
  Rock: "#B8A038",
  Ice: "#98D8D8",
  Dragon: "#7038F8",
  Dark: "#705848",
  Steel: "#B8B8D0",
  Fairy: "#EE99AC",
};

let pokemonRepository = (function () {
  let pokemonList = [
    {
      id: 1,
      name: "Bulbasaur",
      type: ["Grass", "Poison"],
      height: "0.7 m",
      weight: "6.9 kg",
    },
    {
      id: 2,
      name: "Ivysaur",
      type: ["Grass", "Poison"],
      height: "1.0 m",
      weight: "13.0 kg",
    },
    {
      id: 3,
      name: "Venusaur",
      type: ["Grass", "Poison"],
      height: "2.0 m",
      weight: "100.0 kg",
    },
    {
      id: 4,
      name: "Charmander",
      type: ["Fire"],
      height: "0.6 m",
      weight: "8.5 kg",
    },
    {
      id: 5,
      name: "Charmeleon",
      type: ["Fire"],
      height: "1.1 m",
      weight: "19.0 kg",
    },
    {
      id: 6,
      name: "Charizard",
      type: ["Fire", "Flying"],
      height: "1.7 m",
      weight: "90.5 kg",
    },
    {
      id: 7,
      name: "Squirtle",
      type: ["Water"],
      height: "0.5 m",
      weight: "9.0 kg",
    },
    {
      id: 8,
      name: "Wartortle",
      type: ["Water"],
      height: "1.0 m",
      weight: "22.5 kg",
    },
    {
      id: 9,
      name: "Blastoise",
      type: ["Water"],
      height: "1.6 m",
      weight: "85.5 kg",
    },
    {
      id: 10,
      name: "Caterpie",
      type: ["Bug"],
      height: "0.3 m",
      weight: "2.9 kg",
    },
    {
      id: 11,
      name: "Metapod",
      type: ["Bug"],
      height: "0.7 m",
      weight: "9.9 kg",
    },
    {
      id: 12,
      name: "Butterfree",
      type: ["Bug", "Flying"],
      height: "1.1 m",
      weight: "32.0 kg",
    },
    {
      id: 13,
      name: "Weedle",
      type: ["Bug", "Poison"],
      height: "0.3 m",
      weight: "3.2 kg",
    },
    {
      id: 14,
      name: "Kakuna",
      type: ["Bug", "Poison"],
      height: "0.6 m",
      weight: "10.0 kg",
    },
    {
      id: 15,
      name: "Beedrill",
      type: ["Bug", "Poison"],
      height: "1.0 m",
      weight: "29.5 kg",
    },
    {
      id: 16,
      name: "Pidgey",
      type: ["Normal", "Flying"],
      height: "0.3 m",
      weight: "1.8 kg",
    },
    {
      id: 17,
      name: "Pidgeotto",
      type: ["Normal", "Flying"],
      height: "1.1 m",
      weight: "30.0 kg",
    },
    {
      id: 18,
      name: "Pidgeot",
      type: ["Normal", "Flying"],
      height: "1.5 m",
      weight: "39.5 kg",
    },
    {
      id: 19,
      name: "Rattata",
      type: ["Normal"],
      height: "0.3 m",
      weight: "3.5 kg",
    },
    {
      id: 20,
      name: "Raticate",
      type: ["Normal"],
      height: "0.7 m",
      weight: "18.5 kg",
    },
    {
      id: 21,
      name: "Spearow",
      type: ["Normal", "Flying"],
      height: "0.3 m",
      weight: "2.0 kg",
    },
    {
      id: 22,
      name: "Fearow",
      type: ["Normal", "Flying"],
      height: "1.2 m",
      weight: "38.0 kg",
    },
    {
      id: 23,
      name: "Ekans",
      type: ["Poison"],
      height: "2.0 m",
      weight: "6.9 kg",
    },
    {
      id: 24,
      name: "Arbok",
      type: ["Poison"],
      height: "3.5 m",
      weight: "65.0 kg",
    },
    {
      id: 25,
      name: "Pikachu",
      type: ["Electric"],
      height: "0.4 m",
      weight: "6.0 kg",
    },
    {
      id: 26,
      name: "Raichu",
      type: ["Electric"],
      height: "0.8 m",
      weight: "30.0 kg",
    }
  ];

  // Funzione per trovare un Pokémon per nome
  function findPokemonByName(name) {
    return pokemonList.filter(function (pokemon) {
      return pokemon.name.toLowerCase() === name.toLowerCase();
    });
  }
  // Funzione per trovare un Pokémon per ID
  function findPokemonById(id) {
    return pokemonList.filter(function (pokemon) {
      return pokemon.id === id;
    });
  }

  // Funzioni per gestire la lista dei Pokémon
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "id" in pokemon &&
      "type" in pokemon &&
      "height" in pokemon &&
      "weight" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("Pokemon is not valid:", pokemon);
    }
  }
  function getAll() {
    return pokemonList;
  }

  return {
    add: add,
    getAll: getAll,
    findPokemonByName: findPokemonByName,
    findPokemonById: findPokemonById,
  };
})();

let container = document.getElementById("pokemon-container");
let bigTextShown = false; //mostra "Wow, that’s big!" solo una volta

// Crea le card dei Pokémon
function createPokemonCards() {
  pokemonRepository.getAll().forEach(function (pokemon) {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    const color1 = typeColors[pokemon.type[0]] || "#999";
    const color2 = pokemon.type[1] ? typeColors[pokemon.type[1]] : color1;

    card.innerHTML = `
      <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        pokemon.id
      }.png" alt="${pokemon.name}" />
      <div class="pokemon-number">#${pokemon.id
        .toString()
        .padStart(3, "0")}</div>
      <div class="pokemon-name">${pokemon.name}</div>
      <div class="pokemon-type">
      
        ${pokemon.type
          .map(
            (t) =>
              `<span class="type-badge" style="background-color:${typeColors[t]}">${t}</span>`
          )
          .join("")}
      </div>
    `;

    container.appendChild(card);
  });
}

createPokemonCards();
