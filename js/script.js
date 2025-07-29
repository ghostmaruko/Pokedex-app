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

const translations = {
  en: {
    title: "Pokédex App",
    subtitle: "Kanto Pokémon",
    height: "Height",
    type: "Type",
    description: "Description",
  },
  it: {
    title: "Pokédex App",
    subtitle: "Pokémon di Kanto",
    height: "Altezza",
    type: "Tipo",
    description: "Descrizione",
  },
  ja: {
    title: "ポケモン図鑑",
    subtitle: "カントー地方のポケモン",
    height: "高さ",
    type: "タイプ",
    description: "説明",
  },
};

function getUserLanguage() {
  const lang = navigator.language.slice(0, 2);
  return translations[lang] ? lang : "en";
}

let currentLanguage = getUserLanguage();

function applyTranslations(lang) {
  document.querySelector("h1").textContent = translations[lang].subtitle;
  document.querySelector("h2").textContent = translations[lang].title;
  document.querySelectorAll(".pokemon-card").forEach((card) => {
    const name = card.getAttribute(`data-name-${lang}`);
    const types = card.getAttribute(`data-types-${lang}`);
    if (name) {
      card.querySelector(".pokemon-name").textContent = name;
    }
    if (types) {
      const typeArray = types.split(",");
      const typeHTML = typeArray
        .map(
          (t) =>
            `<span class="type-badge" style="background-color:${
              typeColors[t] || "#ccc"
            }">${t}</span>`
        )
        .join("");
      card.querySelector(".pokemon-type").innerHTML = typeHTML;
    }
  });
  // Update modal if it's open
  if (currentPokemon) {
    updateModalTexts(currentPokemon);
  }
}

function updateLanguageButtons(selectedLang) {
  document.querySelectorAll("#language-selector button").forEach((btn) => {
    if (btn.getAttribute("data-lang") === selectedLang) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

function updateModalTexts(pokemon) {
  document.getElementById("modal-name").textContent =
    pokemon.localizedNames[currentLanguage] || capitalizeFirstLetter(pokemon.name);
  document.getElementById("modal-description").textContent =
    pokemon.description || "No description available.";
}

document.querySelectorAll("#language-selector button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const lang = e.currentTarget.getAttribute("data-lang");
    if (translations[lang]) {
      currentLanguage = lang;
      applyTranslations(lang);
      updateLanguageButtons(lang);
      container.innerHTML = "";
      createPokemonCards();
    }
  });
});

let currentPokemon = null;

let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

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

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
            id: item.url.split("/").slice(-2)[0],
            type: [],
            height: 0,
            weight: 0,
            localizedNames: {},
            localizedTypes: {},
          };
          add(pokemon);
        });
        hideLoadingMessage();
      })
      .catch(function (e) {
        console.error("Error loading Pokémon list:", e);
        hideLoadingMessage();
      });
  }

  function loadDetails(item) {
    showLoadingMessage();
    return fetch(item.detailsUrl)
      .then((response) => response.json())
      .then((details) => {
        item.id = details.id;
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
        return fetch(`https://pokeapi.co/api/v2/pokemon-species/${item.id}/`);
      })
      .then((response) => response.json())
      .then((speciesDetails) => {
        const flavor =
          speciesDetails.flavor_text_entries.find(
            (entry) => entry.language.name === currentLanguage
          ) ||
          speciesDetails.flavor_text_entries.find(
            (entry) => entry.language.name === "en"
          );
        item.description = flavor
          ? flavor.flavor_text.replace(/\n|\f/g, " ")
          : "No description available.";

        item.localizedNames = {};
        item.localizedTypes = {};
        speciesDetails.names.forEach((n) => {
          if (translations[n.language.name]) {
            item.localizedNames[n.language.name] = n.name;
          }
        });
        item.types.forEach((typeObj) => {
          const typeName = typeObj.type.name;
          item.localizedTypes[typeName] = {};
          Object.keys(translations).forEach((lang) => {
            item.localizedTypes[typeName][lang] = capitalizeFirstLetter(typeName);
          });
        });
        hideLoadingMessage();
      })
      .catch((e) => {
        console.error(e);
        hideLoadingMessage();
      });
  }

  function showDetails(pokemon) {
    currentPokemon = pokemon;
    pokemonRepository.loadDetails(pokemon).then(function () {
      const modal = document.getElementById("modal");
      const modalImage = document.getElementById("modal-image");
      modalImage.src = pokemon.imageUrl;
      modalImage.alt = pokemon.name;
      updateModalTexts(pokemon);
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let container = document.getElementById("pokemon-container");

function createPokemonCards() {
  pokemonRepository.getAll().forEach(function (pokemon) {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    const name =
      pokemon.localizedNames[currentLanguage] ||
      capitalizeFirstLetter(pokemon.name);
    const types = pokemon.types.map((t) => capitalizeFirstLetter(t.type.name));
    const localizedTypes = types.map((t) => t);
    const color1 = typeColors[types[0]] || "#999";

    card.setAttribute(`data-name-${currentLanguage}`, name);
    card.setAttribute(`data-types-${currentLanguage}`, localizedTypes.join(","));

    card.innerHTML = `
      <img class="pokemon-image" src="${pokemon.imageUrl}" alt="${
      pokemon.name
    }" />
      <div class="pokemon-number">#${pokemon.id.toString().padStart(3, "0")}</div>
      <div class="pokemon-name">${name}</div>
      <div class="pokemon-type">
        ${types
          .map(
            (t) =>
              `<span class="type-badge" style="background-color:${
                typeColors[t]
              }">${t}</span>`
          )
          .join("")}
      </div>
    `;

    card.addEventListener("click", function () {
      pokemonRepository.showDetails(pokemon);
    });

    container.appendChild(card);
  });
}

pokemonRepository.loadList().then(function () {
  let promises = pokemonRepository
    .getAll()
    .map((pokemon) => pokemonRepository.loadDetails(pokemon));
  Promise.all(promises).then(function () {
    createPokemonCards();
  });
});

(function () {
  const modal = document.getElementById("modal");
  const closeButton = document.getElementById("close-button");
  const modalContent = document.querySelector(".modal-content");

  closeButton.addEventListener("click", function () {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", function (event) {
    if (!modalContent.contains(event.target)) {
      modal.classList.add("hidden");
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });
})();

applyTranslations(currentLanguage);
