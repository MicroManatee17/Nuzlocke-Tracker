// =======================
// PARTY TAB
// =======================

const TYPE_COLORS = {
  Normal:  "#A8A878",
  Fire:    "#F08030",
  Water:   "#6890F0",
  Electric:"#F8D030",
  Grass:   "#78C850",
  Ice:     "#98D8D8",
  Fighting:"#C03028",
  Poison:  "#A040A0",
  Ground:  "#E0C068",
  Flying:  "#A890F0",
  Psychic: "#F85888",
  Bug:     "#A8B820",
  Rock:    "#B8A038",
  Ghost:   "#705898",
  Dragon:  "#7038F8",
  Dark:    "#705848",
  Steel:   "#B8B8D0",
  Fairy:   "#EE99AC"
};


// ------------------ Populate datalists ------------------
function populateDatalists() {
  const pList = document.getElementById("pokemon-list");
  const mList = document.getElementById("move-list");
  const aList = document.getElementById("ability-list");
  const iList = document.getElementById("item-list");
  const rList = document.getElementById("route-list");

  if (pList) {
    pList.innerHTML = state.dex.pokemon
      .map(p => `<option value="${p.name}">`)
      .join("");
  }

  if (mList) {
    mList.innerHTML = state.dex.moves
      .map(m => `<option value="${m.name}">`)
      .join("");
  }

  if (aList) {
    aList.innerHTML = state.dex.abilities
      .map(a => `<option value="${a}">`)
      .join("");
  }

  if (iList) {
    iList.innerHTML = state.dex.items
      .map(i => `<option value="${i}">`)
      .join("");
  }

  if (rList) {
    rList.innerHTML = (window.ROUTE_LIST || [])
      .map(r => `<option value="${r}">`)
      .join("");
  }
}

// ------------------ Render datalists (utility) ------------------
function renderDatalists() {
  const moveList = document.getElementById("move-list");
  if (moveList) {
    moveList.innerHTML = state.dex.moves
      .map(m => `<option value="${m.name}"></option>`)
      .join("");
  }

  const abilityList = document.getElementById("ability-list");
  if (abilityList) {
    abilityList.innerHTML = state.dex.abilities
      .map(a => `<option value="${a}"></option>`)
      .join("");
  }

  const itemList = document.getElementById("item-list");
  if (itemList) {
    itemList.innerHTML = state.dex.items
      .map(i => `<option value="${i}"></option>`)
      .join("");
  }
}

// ------------------ Stat Panel ------------------
function extractBaseStats(mon) {
  if (!mon) return null;

  return {
    HP: mon.baseHP,
    Atk: mon.baseAtk,
    Def: mon.baseDef,
    SpA: mon.baseSpAtk,
    SpD: mon.baseSpDef,
    Spe: mon.baseSpeed
  };
}

// Convert stat (0–255) → RGB gradient
function statToColor(value) {
  const clamped = Math.max(0, Math.min(255, value));

  let r = 0, g = 0, b = 0;

  if (clamped <= 128) {
    // Red → Green
    r = 255 - Math.round((clamped / 128) * 255);
    g = Math.round((clamped / 128) * 255);
  } else {
    // Green → Blue
    g = 255 - Math.round(((clamped - 128) / 127) * 255);
    b = Math.round(((clamped - 128) / 127) * 255);
  }

  return `rgb(${r}, ${g}, ${b})`;
}

function bstToColor(bst) {
  const maxBST = 720;
  const scaled = Math.round((bst / maxBST) * 255);
  return statToColor(scaled);
}

function createStatPanel(mon) {
  const stats = extractBaseStats(mon);

  if (!stats) {
    return `
      <div class="stat-panel muted">
        Select a Pokémon
      </div>
    `;
  }

  const bst = Object.values(stats).reduce((a, b) => a + b, 0);
  const bstColor = bstToColor(bst);
  const bstPercent = (bst / 720) * 100;

  const maxStat = 255;

  return `
    <div class="stat-panel">
      ${Object.entries(stats).map(([name, value]) => `
        <div class="stat-row">
          <span class="stat-name">${name}</span>

          <div class="stat-bar-container">
            <div
              class="stat-bar"
              style="
                width: ${(value / maxStat) * 100}%;
                background-color: ${statToColor(value)};
              "
            ></div>
          </div>

          <span class="stat-value">${value}</span>
        </div>
      `).join("")}

      <div class="bst-row">
        <span class="bst-label">BST</span>

        <div class="bst-bar-container">
          <div
            class="bst-bar"
            style="
              width: ${bstPercent}%;
              background-color: ${bstColor};
            "
          ></div>
        </div>

        <span class="bst-value">${bst}</span>
      </div>
    </div>
  `;
}

// ------------------ Render Party ------------------
function renderParty() {
  const container = document.getElementById("party-container");
  container.innerHTML = "";

  state.party.forEach((p, i) => {
    // Normalize old save data
    if (!Array.isArray(p.moves)) p.moves = ["", "", "", ""];
    if (typeof p.ability !== "string") p.ability = "";
    if (typeof p.item !== "string") p.item = "";
    if (typeof p.species !== "string") p.species = "";

    const div = document.createElement("div");
    div.className = "party-card";

    // Match Pokémon safely (case-insensitive)
    const mon = state.dex.pokemon.find(
      m => m.name.toLowerCase() === (p.species || "").toLowerCase()
    );
    const types = mon ? mon.types : [];

    // -------- Gradient background --------
    if (types.length > 0) {
      const primary = TYPE_COLORS[types[0]] || "#2a2a2a";
      const secondary = TYPE_COLORS[types[1]] || primary;

      div.style.setProperty("--type-color-1", primary);
      div.style.setProperty("--type-color-2", secondary);
    } else {
      div.style.setProperty("--type-color-1", "#2a2a2a");
      div.style.setProperty("--type-color-2", "#2a2a2a");
    }

    const spritePath = p.species
      ? `assets/sprites/${p.species.toLowerCase()}.png`
      : "";

    const typeIcons = types.map(t =>
      `<img src="assets/types/${t.toLowerCase()}.png" class="type-icon" onerror="this.style.display='none'">`
    ).join("");

    div.innerHTML = `
      <div class="party-left">
        <input
          list="pokemon-list"
          class="pokemon-search"
          placeholder="Search Pokémon"
          value="${p.species}"
          oninput="
            state.party[${i}].species = this.value;
            saveState();
          "
          onblur="
            if (!state.dex.pokemon.some(m => m.name === this.value)) {
              state.party[${i}].species = '';
              this.value = '';
            }
            renderParty();
            saveState();
          "
        >

        <img
          class="sprite"
          src="${spritePath}"
          onerror="this.style.display='none'"
        >

        <div class="type-icons">${typeIcons}</div>

        <input
          list="ability-list"
          value="${p.ability}"
          placeholder="Ability"
          oninput="state.party[${i}].ability = this.value; saveState();"
          onblur="
            if (!state.dex.abilities.includes(this.value)) {
              state.party[${i}].ability = '';
              this.value = '';
            }
            renderParty();
            saveState();
          "
        >

        <input
          list="item-list"
          value="${p.item}"
          placeholder="Item"
          oninput="state.party[${i}].item = this.value; saveState();"
          onblur="
            if (!state.dex.items.includes(this.value)) {
              state.party[${i}].item = '';
              this.value = '';
            }
            renderParty();
            saveState();
          "
        >
      </div>

      <div class="party-middle">
        ${createStatPanel(mon)}
      </div>

      <div class="party-right">
        <label>Moves</label>
        <div class="move-list">
          ${p.moves.map((mv, mIndex) => `
            <input
              list="move-list"
              value="${mv}"
              placeholder="Move ${mIndex + 1}"
              oninput="state.party[${i}].moves[${mIndex}] = this.value; saveState();"
              onblur="
                const val = this.value.trim();
                const isValid = state.dex.moves.some(m => m.toLowerCase() === val.toLowerCase());
                if (!isValid && val !== '') {
                  state.party[${i}].moves[${mIndex}] = '';
                  this.value = '';
                } else {
                  state.party[${i}].moves[${mIndex}] = val;
                  this.value = val;
                }
                saveState();
              "
            >
          `).join("")}
        </div>
      </div>

      <button class="remove-btn" onclick="removePartyMon(${i})">✕</button>
    `;

    container.appendChild(div);
  });
}

// ------------------ Remove Pokémon ------------------
function removePartyMon(index) {
  state.party[index] = {
    species: "",
    moves: ["", "", "", ""],
    ability: "",
    item: ""
  };
  saveState();
  renderParty();
}

// ------------------ Initialize Party Tab ------------------
function initPartyTab() {
  populateDatalists();
  renderDatalists();
  renderParty();
}