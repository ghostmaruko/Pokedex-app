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
];

let container = document.getElementById("pokemon-container");
let bigTextShown = false; //mostra "Wow, that’s big!" solo una volta

for (let i = 0; i < pokemonList.length; i++) {
  let pokemon = pokemonList[i];
  let pokemonDiv = document.createElement("div");
  pokemonDiv.classList.add("pokemon-card");

  // Set colore dinamico
  let type1 = pokemon.type[0];
  let type2 = pokemon.type[1];

  let color1 = typeColors[type1] || "#ccc";
  let color2 = type2 ? typeColors[type2] || "#ccc" : color1;

  // gradient metà e metà
  pokemonDiv.style.background = `linear-gradient(to right, ${color1} 0%, ${color1} 50%, ${color2} 50%, ${color2} 100%)`;

  // Immagine
  let image = document.createElement("img");
  image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  image.alt = pokemon.name;

  // Parse height & weight
  let heightNumber = parseFloat(pokemon.height); // da "1.7 m" a 1.7
  let weightNumber = parseFloat(pokemon.weight); // da "90.5 kg" a 90.5

  // Debug info in console
  console.log(`${pokemon.name}: ${heightNumber} m`);

  // Contenuto
  let infoHTML = `
    <h2>${pokemon.name}</h2>
    <p>Type: ${pokemon.type.join(", ")}</p>
    <p>Height: ${pokemon.height} m</p>
    <p>Weight: ${pokemon.weight} kg</p>
  `;

  // Mostra "Wow, that's big!" solo per il primo che supera 1.6 m
  if (heightNumber > 1.5 && !bigTextShown) {
    infoHTML += `<p class="big">Wow, that’s big!</p>`;
    console.log(`${pokemon.name} è alto ${heightNumber} m - Wow, that’s big!`);
    bigTextShown = true;
  }

  pokemonDiv.appendChild(image);
  pokemonDiv.innerHTML += infoHTML;
  container.appendChild(pokemonDiv);
}
