📱 Pokédex App

# Pokédex App

Questa è una semplice applicazione Pokédex realizzata con HTML, CSS e JavaScript vanilla. L'applicazione carica i dati di 150 Pokémon dalla PokéAPI e li mostra in una griglia di card.

## Funzionalità principali

- Caricamento dei dati da API esterna (https://pokeapi.co)
- Visualizzazione dei Pokémon con immagine, numero, nome e tipi
- Modal per mostrare i dettagli del Pokémon cliccato
  - Nome
  - Altezza
  - Tipi
  - Immagine
  - (In futuro: descrizione testuale del Pokémon)
  - Chiusura modale tramite:
  - Bottone "Chiudi"
  - Tasto ESC
  - Clic fuori dalla modale
- Layout responsive

## Tecnologie usate

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API
- PokéAPI

## Struttura del progetto

- `index.html`: struttura base della pagina
- `styles.css`: styling e responsive layout
- `scripts.js`: logica dell'applicazione, gestione modale, caricamento dati e UI

## Note

L'applicazione è realizzata seguendo il corso di CareerFoundry e implementa pattern UI comuni come modali e validazioni. La modale è implementata da zero senza librerie esterne.

## Possibili miglioramenti futuri

- Aggiunta della descrizione testuale del Pokémon (come nelle carte Pokémon)
- Funzionalità di ricerca o filtro
- Ordinamento per nome/altezza/tipo
- Modal dialog con conferme e interazioni
