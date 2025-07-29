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
        hideLoadingMessage(); // Nascondi il messaggio di caricamento dopo aver caricato la lista
        console.log("Lista Pokémon caricata:", pokemonList); // Log della lista dei Pokémon caric
      })
      .catch(function (e) {
        console.error("Error loading Pokémon list:", e);
        hideLoadingMessage(); // Nascondi il messaggio di caricamento in caso di errore
      });
  }

  function loadDetails(item) {
    showLoadingMessage(); // Mostra il messaggio di caricamento prima di fare la richiesta
    console.log("Dettagli del Pokémon:", item); // Log dei dettagli del Pokémon prima di fare la richiesta

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

        // fetch: ottenere descrizione ogni pokémon
        return fetch(`https://pokeapi.co/api/v2/pokemon-species/${item.id}/`);
      })
      .then((response) => response.json())
      .then((speciesDetails) => {
        const flavor = speciesDetails.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        item.description = flavor
          ? flavor.flavor_text.replace(/\n|\f/g, " ")
          : "No description available.";
        hideLoadingMessage(); // Nascondi il messaggio di caricamento dopo aver caricato i dettagli
        console.log("Dettagli del Pokémon aggiornati:", item); // Log dei dettagli aggiornati del Pokémon
      })
      .catch((e) => {
        console.error(e);
        hideLoadingMessage(); // Nascondi il messaggio di caricamento in caso di errore
      });
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      const modal = document.getElementById("modal");
      const modalImage = document.getElementById("modal-image");
      const modalName = document.getElementById("modal-name");
      const modalHeight = document.getElementById("modal-height");
      const modalTypes = document.getElementById("modal-types");
      const modalDescription = document.getElementById("modal-description");

      modalImage.src = pokemon.imageUrl;
      modalImage.alt = pokemon.name;
      modalName.textContent = capitalizeFirstLetter(pokemon.name);
      modalHeight.textContent = pokemon.height;
      modalDescription.textContent =
        pokemon.description || "No description available.";

      // Mostra tipi
      const types = pokemon.types.map((t) =>
        capitalizeFirstLetter(t.type.name)
      );
      modalTypes.textContent = types.join(", ");

      modal.classList.remove("hidden");
    });
  }

  function showLoadingMessage() {
    let message = document.createElement("p");
    message.id = "loading-message";
    message.innerText = "Loading...";
    document.body.appendChild(message);
  }

  function hideLoadingMessage() {
    const message = document.getElementById("loading-message");
    if (message) message.remove();
  }

  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showLoadingMessage: showLoadingMessage,
    hideLoadingMessage: hideLoadingMessage,
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
    const types = pokemon.types.map((t) => capitalizeFirstLetter(t.type.name));
    const color1 = typeColors[types[0]] || "#999";
    const color2 = types[1] ? typeColors[types[1]] : color1;

    card.innerHTML = `
      <img class="pokemon-image" src="${pokemon.imageUrl}" alt="${
      pokemon.name
    }" />

      <div class="pokemon-number">#${pokemon.id
        .toString()
        .padStart(3, "0")}</div>
      <div class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</div>
      <div class="pokemon-type">
        ${types
          .map(
            (t) =>
              `<span class="type-badge" style="background-color:${typeColors[t]}">${t}</span>`
          )
          .join("")}
      </div>
    `;

    // evento per mostrare i dettagli del Pokémon al click
    card.addEventListener("click", function () {
      pokemonRepository.showDetails(pokemon);
    });

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

// Gestione del modal IIFE
// Gestione del modal per mostrare i dettagli del Pokémon
// Nascondi il modal inizialmente
(function () {
  const modal = document.getElementById("modal");
  const closeButton = document.getElementById("close-button");
  const modalContent = document.querySelector(".modal-content");

  // Chiudi con il pulsante
  closeButton.addEventListener("click", function () {
    modal.classList.add("hidden");
  });

  // Chiudi cliccando fuori dal contenuto
  modal.addEventListener("click", function (event) {
    if (!modalContent.contains(event.target)) {
      modal.classList.add("hidden");
    }
  });

  // Chiudi con ESC
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });
})();

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
