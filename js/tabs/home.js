// ==================== HOME TAB LOGIC ====================

const homeCategory = document.getElementById('home-category');
const homeSearchInput = document.getElementById('home-search-input');
const homeSearchOptions = document.getElementById('home-search-options');
const homeInfoDisplay = document.getElementById('home-info-display');

function getHomeList(type) {
  if (type === "pokemon") return state.dex.pokemon;
  if (type === "move") return state.dex.moves;
  if (type === "item") return state.dex.items.map(i => ({ name: i }));
  if (type === "ability") return state.dex.abilities.map(a => ({ name: a }));
  return [];
}

function updateHomePlaceholder() {
  const type = homeCategory.value;
  homeSearchInput.value = '';
  homeSearchInput.placeholder = `Search ${type}...`;
  homeSearchOptions.innerHTML = '';
  homeSearchOptions.style.display = 'none';
}

// ------------------ DEX TAB ------------------
function populateDex() {
  const dexP = document.getElementById("dex-pokemon");
  const dexM = document.getElementById("dex-moves");
  const dexA = document.getElementById("dex-abilities");
  const dexI = document.getElementById("dex-items");

  if (!dexP || !dexM || !dexA || !dexI) return;

  dexP.innerHTML = state.dex.pokemon.map(p => `<option>${p.name}</option>`).join("");
  dexM.innerHTML = state.dex.moves.map(m => `<option>${m.name}</option>`).join("");
  dexA.innerHTML = state.dex.abilities.map(a => `<option>${a}</option>`).join("");
  dexI.innerHTML = state.dex.items.map(i => `<option>${i}</option>`).join("");
}

function populateHomeOptions(query = "") {
  const type = homeCategory.value;
  const list = getHomeList(type);

  homeSearchOptions.innerHTML = "";

  const results = fuzzyFilter(list, query, 12);

  results.forEach(obj => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = obj.name;
    div.onclick = () => selectHomeOption(obj.name);
    homeSearchOptions.appendChild(div);
  });

  homeSearchOptions.style.display =
    results.length ? "block" : "none";
}

function selectHomeOption(name) {
  homeSearchInput.value = name;
  homeSearchOptions.style.display = 'none';
  renderHomeInfo(name);
}

function renderHomeInfo(name) {
  const type = homeCategory.value;
  let html = '';

    if (type === 'pokemon') {
    const p = state.dex.pokemon.find(x => x.name === name);
    if (!p) return;

    html = `
        <h3>${name}</h3>
        <p><strong>Types:</strong> ${p.types.join(" / ")}</p>
        <p><strong>Ability:</strong> ${p.ability || "—"}</p>
        <p><strong>Base Stats:</strong>
        HP ${p.hp}, Atk ${p.atk}, Def ${p.def},
        SpA ${p.spa}, SpD ${p.spd}, Spe ${p.spe}
        </p>
    `;
    }


    if (type === "move") {
    const m = state.dex.moves.find(x => x.name === name);
    if (!m) return;

    html = `
        <h3>${name}</h3>
        <p><strong>Type:</strong> ${m.type}</p>
        <p><strong>Category:</strong> ${m.category}</p>
        <p><strong>Power:</strong> ${m.power}</p>
        <p><strong>Accuracy:</strong> ${m.accuracy}</p>
        <p><strong>PP:</strong> ${m.pp}</p>
        <p><strong>Effect:</strong> ${m.effect || "—"}</p>
    `;
    }


  if (type === 'item') {
    const i = ITEM_LIST[name];
    html = `
      <h3>${name}</h3>
      <p><strong>Effect:</strong> ${i.effect}</p>
    `;
  }

  if (type === 'ability') {
    const a = ABILITY_LIST[name];
    html = `
      <h3>${name}</h3>
      <p><strong>Effect:</strong> ${a.effect}</p>
    `;
  }

  homeInfoDisplay.innerHTML = html || `<p>No data available.</p>`;
}

// Event Wiring
homeSearchInput.addEventListener("input", e => {
  populateHomeOptions(e.target.value.trim());
});

homeSearchInput.addEventListener("focus", () => {
  populateHomeOptions(homeSearchInput.value.trim());
});

homeCategory.addEventListener("change", () => {
  updateHomePlaceholder();
});

// Init
updateHomePlaceholder();