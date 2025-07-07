alert("Hello, World!");
console.log("This is a message in the console.");

let favoritePokemon = "Pikachu";
// document.write(favoritePokemon); ==> .write is deprecated. Best to use getElementById or similar methods.
document.getElementById("output").textContent = favoritePokemon;
console.log("My favorite Pokémon is " + favoritePokemon + ".");
favoritePokemon = "Bulbasaur";
document.getElementById("output").textContent = favoritePokemon;
console.log("My new favorite Pokémon is " + favoritePokemon + ".");
