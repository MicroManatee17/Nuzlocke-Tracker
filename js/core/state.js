// ------------------ STATE ------------------
let state = {
  party: Array(6).fill(null).map(() => ({
    species: "",
    moves: ["", "", "", ""],
    ability: "",
    item: ""
  })),
  caught: [],
  dex: {
    pokemon: [],
    moves: [],
    abilities: [],
    items: []
  }
};

// ------------------ LOCAL STORAGE ------------------
function saveState() {
  localStorage.setItem("rr-nuzlocke", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("rr-nuzlocke");
  if (saved) state = JSON.parse(saved);
}

// ------------------ HYDRATE DEX ------------------
function hydrateDex() {
  state.dex.pokemon   = window.POKEMON_LIST || [];
  state.dex.moves     = window.MOVES_LIST || [];
  state.dex.abilities = window.ABILITY_LIST || [];
  state.dex.items     = window.ITEM_LIST || [];
}