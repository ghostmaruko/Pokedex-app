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
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  // Funzione per aggiungere un Pokémon alla lista
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

  // Funzione per caricare i Pokémon dall'API
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        console.log("lista completa Pokémon (JSON):", json); // Log della lista completa dei Pokémon
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
            id: item.url.split("/").slice(-2)[0], // Estrae l'ID dall'URL
            type: [], // Inizializza un array vuoto per il tipo
            height: 0, // Inizializza l'altezza a 0
            weight: 0, // Inizializza il peso a 0
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error("Error loading Pokémon list:", e);
      });
  }

  function loadDetails(item) {
    return fetch(item.detailsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        console.log("Dettagli del Pokémon:", details); // Log dei dettagli del Pokémon
        item.id = details.id;
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
    });
  }

  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

// funzione per capitalizzare la prima lettera di una stringa
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let container = document.getElementById("pokemon-container");

// Crea le card dei Pokémon
function createPokemonCards() {
  pokemonRepository.getAll().forEach(function (pokemon) {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    // Estrai i nomi dei tipi (es. "Fire", "Flying")
    const types = pokemon.types.map(t => capitalizeFirstLetter(t.type.name));
    const color1 = typeColors[types[0]] || "#999";
    const color2 = types[1] ? typeColors[types[1]] : color1;

    card.innerHTML = `
      <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" />
      <div class="pokemon-number">#${pokemon.id.toString().padStart(3, "0")}</div>
      <div class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</div>
      <div class="pokemon-type">
        ${types
          .map(
            (t) => `<span class="type-badge" style="background-color:${typeColors[t]}">${t}</span>`
          )
          .join("")}
      </div>
    `;

    container.appendChild(card);
  });
}


// carica i dati dall'API e crea le card
pokemonRepository.loadList().then(function () {
  let promises = pokemonRepository
    .getAll()
    .map((pokemon) => pokemonRepository.loadDetails(pokemon));
  Promise.all(promises).then(function () {
    createPokemonCards();
  });
});

// Funzione per trovare un Pokémon per nome
/*   function findPokemonByName(name) {
    return pokemonList.filter(function (pokemon) {
      return pokemon.name.toLowerCase() === name.toLowerCase();
    });
  } */
// Funzione per trovare un Pokémon per ID
/*   function findPokemonById(id) {
    return pokemonList.filter(function (pokemon) {
      return pokemon.id === id;
    });
  } */

/* pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
}); */
