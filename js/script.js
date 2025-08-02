// --- Traduzioni tipo Pokémon ---
const typeTranslations = {
  en: {
    Fire: "Fire",
    Water: "Water",
    Grass: "Grass",
    Electric: "Electric",
    Psychic: "Psychic",
    Ice: "Ice",
    Dragon: "Dragon",
    Dark: "Dark",
    Fairy: "Fairy",
    Normal: "Normal",
    Fighting: "Fighting",
    Flying: "Flying",
    Poison: "Poison",
    Ground: "Ground",
    Rock: "Rock",
    Bug: "Bug",
    Ghost: "Ghost",
    Steel: "Steel",
  },
  it: {
    Fire: "Fuoco",
    Water: "Acqua",
    Grass: "Erba",
    Electric: "Elettro",
    Psychic: "Psico",
    Ice: "Ghiaccio",
    Dragon: "Drago",
    Dark: "Buio",
    Fairy: "Folletto",
    Normal: "Normale",
    Fighting: "Lotta",
    Flying: "Volante",
    Poison: "Veleno",
    Ground: "Terra",
    Rock: "Roccia",
    Bug: "Coleottero",
    Ghost: "Spettro",
    Steel: "Acciaio",
  },
  ja: {
    Fire: "ほのお",
    Water: "みず",
    Grass: "くさ",
    Electric: "でんき",
    Psychic: "エスパー",
    Ice: "こおり",
    Dragon: "ドラゴン",
    Dark: "あく",
    Fairy: "フェアリー",
    Normal: "ノーマル",
    Fighting: "かくとう",
    Flying: "ひこう",
    Poison: "どく",
    Ground: "じめん",
    Rock: "いわ",
    Bug: "むし",
    Ghost: "ゴースト",
    Steel: "はがね",
  },
};

// --- Traduzioni interfaccia ---
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

// --- Colori tipo Pokémon (sempre inglese come chiave) ---
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
  Fighting: "#C03028",
  Ghost: "#705898",
};

// --- Repository Pokémon ---
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
      .then((response) => response.json())
      .then((json) => {
        json.results.forEach((item) => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
            id: item.url.split("/").slice(-2)[0],
            type: [],
            height: 0,
            weight: 0,
            localizedNames: {},
          };
          add(pokemon);
        });
        hideLoadingMessage();
      })
      .catch((e) => {
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

        speciesDetails.names.forEach((n) => {
          if (translations[n.language.name]) {
            item.localizedNames[n.language.name] = n.name;
          }
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
      const modalImage = document.getElementById("modal-image");
      const modalName = document.getElementById("pokemonModalLabel");
      const modalHeight = document.getElementById("modal-height");
      const modalTypes = document.getElementById("modal-types");
      const modalDescription = document.getElementById("modal-description");

      modalImage.src = pokemon.imageUrl;
      modalImage.alt = pokemon.name;
      modalName.textContent =
        pokemon.localizedNames[currentLanguage] ||
        capitalizeFirstLetter(pokemon.name);
      modalHeight.textContent = `${translations[currentLanguage].height}: ${
        pokemon.height / 10
      } m`;

      const typeHTML = pokemon.types
        .map((t) => {
          const englishType = capitalizeFirstLetter(t.type.name);
          const translated =
            typeTranslations[currentLanguage][englishType] || englishType;
          const color = typeColors[englishType] || "#ccc";
          return `<span class="badge badge-pill" style="background-color: ${color}">${translated}</span>`;
        })
        .join(" ");

      modalTypes.innerHTML = `${translations[currentLanguage].type}: ${typeHTML}`;
      modalDescription.textContent =
        pokemon.description || "No description available.";

      $("#pokemonModal").modal("show");
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
    add,
    getAll,
    loadList,
    loadDetails,
    showDetails,
    showLoadingMessage,
    hideLoadingMessage,
  };
})();

// --- Utils ---
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// --- Applica traduzioni base (h1/h2) ---
function applyTranslations(lang) {
  document.querySelector("h1").textContent = translations[lang].subtitle;
  document.querySelector("h2").textContent = translations[lang].title;
}

// --- Generazione Card ---
let container = document.getElementById("pokemon-container");

function createPokemonCards() {
  container.innerHTML = "";
  pokemonRepository.getAll().forEach(function (pokemon) {
    const card = document.createElement("div");
    card.className = "pokemon-card card";

    const name =
      pokemon.localizedNames[currentLanguage] ||
      capitalizeFirstLetter(pokemon.name);

    const types = pokemon.types.map((t) => {
      const englishType = capitalizeFirstLetter(t.type.name);
      return {
        english: englishType,
        translated:
          typeTranslations[currentLanguage][englishType] || englishType,
      };
    });

    card.innerHTML = `
      <img class="pokemon-image" src="${pokemon.imageUrl}" alt="${
      pokemon.name
    }" />
      <div class="pokemon-number">#${pokemon.id
        .toString()
        .padStart(3, "0")}</div>
      <div class="pokemon-name">${name}</div>
      <div class="pokemon-type">
        ${types
          .map(
            (t) =>
              `<span class="type-badge" style="background-color:${
                typeColors[t.english] || "#ccc"
              }">${t.translated}</span>`
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

// --- Gestione cambio lingua ---
document.querySelectorAll("#language-selector button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const lang = e.currentTarget.getAttribute("data-lang");
    if (translations[lang]) {
      currentLanguage = lang;
      applyTranslations(lang);
      createPokemonCards();
    }
  });
});

// --- Caricamento iniziale ---
let currentPokemon = null;

pokemonRepository.loadList().then(function () {
  let promises = pokemonRepository
    .getAll()
    .map((pokemon) => pokemonRepository.loadDetails(pokemon));
  Promise.all(promises).then(function () {
    applyTranslations(currentLanguage);
    createPokemonCards();
  });
});

// --- Modalità Giorno/Notte ---
const themeToggle = document.getElementById("theme-toggle");
const userPref = localStorage.getItem("theme");

if (userPref === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.classList.add("active");
  themeToggle.textContent = "🌞";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  themeToggle.classList.toggle("active");
  themeToggle.textContent = isDark ? "🌞" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// --- Ricerca Pokémon ---
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = e.target.querySelector("input").value.trim().toLowerCase();
  const allCards = document.querySelectorAll(".pokemon-card");
  // Se il campo è vuoto, mostra tutte le card
  if (query === "") {
    allCards.forEach((card) => (card.style.display = "block"));
    return;
  }
  // Altrimenti, filtra in base al nome
  allCards.forEach((card) => {
    const name = card.querySelector(".pokemon-name").textContent.toLowerCase();
    const match = name.includes(query);
    card.style.display = match ? "block" : "none";
  });
});
