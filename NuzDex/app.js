// ------------------ TYPE CHART ------------------
const TYPE_CHART = {
  Normal: {},
  Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
  Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
  Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5, Ground: 0 },
  Grass: { Water: 2, Ground: 2, Rock: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
  Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5 },
  Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5 },
  Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
  Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
  Steel: { Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
  Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 }
};

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

// ------------------ TAB NAVIGATION ------------------
function showTab(id) {
  document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "party") renderParty();
  if (id === "caught") renderCaught();
  if (id === "coverage") renderCoverage();
  if (id === "damage") populateCalcDropdowns();
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

// ------------------ PARTY TAB ------------------
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
    rList.innerHTML = (window.ROUTE_LIST || []).map(r => `<option value="${r}">`).join("");
  }
}

function renderDatalists() {
  const moveList = document.getElementById("move-list");
  if (moveList) {
    moveList.innerHTML = state.dex.moves
      .map(m => `<option value="${m.name}"></option>`)  // ✅ just the name
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

    const mon = state.dex.pokemon.find(m => m.name === p.species);
    const types = mon ? mon.types : [];

    const spritePath = p.species
      ? `assets/sprites/${p.species.toLowerCase()}.png`
      : "";

    const typeIcons = types.map(t =>
      `<img src="assets/types/${t.toLowerCase()}.png" class="type-icon" onerror="this.style.display='none'">`
    ).join("");

    div.innerHTML = `
      <div class="party-header">
        <img src="${spritePath}" class="sprite" onerror="this.style.display='none'">

        <input
            list="pokemon-list"
            value="${p.species || ""}"
            placeholder="Search Pokémon"

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

        ${p.species ? `
            <button class="remove-btn" onclick="removePartyMon(${i})">✕</button>
        ` : ``}
        </div>

      <div class="type-icons">${typeIcons}</div>

      <input
        list="ability-list"
        value="${p.ability || ""}"
        placeholder="Search Ability"

        oninput="
            state.party[${i}].ability = this.value;
            saveState();
        "

        onblur="
            if (!state.dex.abilities.includes(this.value)) {
            state.party[${i}].ability = '';
            this.value = '';
            }
            renderParty();
            saveState();
        "
        >

      <label>Item</label>
      <input
        list="item-list"
        value="${p.item || ""}"
        placeholder="Search Item"

        oninput="
            state.party[${i}].item = this.value;
            saveState();
        "

        onblur="
            if (!state.dex.items.includes(this.value)) {
            state.party[${i}].item = '';
            this.value = '';
            }
            renderParty();
            saveState();
        "
        >

      <label>Moves</label>
        <div class="move-grid">
        ${p.moves.map((mv, mIndex) => `
            <input
            list="move-list"
            value="${mv || ""}"
            placeholder="Move ${mIndex + 1}"

            oninput="
                state.party[${i}].moves[${mIndex}] = this.value;
                saveState();
            "

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

    `;

    container.appendChild(div);
  });
}

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

// ------------------ CAUGHT TAB ------------------
function populateRouteDropdown() {
  const sel = document.getElementById("route-name");
  if (!sel) return;

  sel.innerHTML = "";
  (window.ROUTE_LIST || []).forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    sel.appendChild(opt);
  });
}

function populateCaughtDropdowns() {
  const monSel = document.getElementById("caught-pokemon");
  const abilitySel = document.getElementById("caught-ability");
  if (!monSel || !abilitySel) return;

  monSel.innerHTML = "";
  abilitySel.innerHTML = "";

  state.dex.pokemon.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    monSel.appendChild(opt);
  });

  state.dex.abilities.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    abilitySel.appendChild(opt);
  });
}

function addCaught() {
  const route = document.getElementById("route-name").value;
  const species = document.getElementById("caught-pokemon").value;
  const ability = document.getElementById("caught-ability").value;

  if (!route || !species) return;

  state.caught.push({ route, species, ability });
  saveState();
  renderCaught();
}

function renderCaught() {
  const list = document.getElementById("caught-list");
  if (!list) return;

  list.innerHTML = "";

  state.caught.forEach((c, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
  <strong>${c.route}</strong>: ${c.species} (${c.ability})
  <button onclick="addCaughtToParty(${index})">Add to Party</button>
  <button onclick="removeCaught(${index})">✕</button>
`;

    list.appendChild(li);
  });
}

function removeCaught(index) {
  state.caught.splice(index, 1);
  saveState();
  renderCaught();
}

function addCaughtToParty(caughtIndex) {
  const caught = state.caught[caughtIndex];
  if (!caught) return;

  const slot = state.party.findIndex(p => !p.species);

  if (slot === -1) {
    alert("Party is full!");
    return;
  }

  state.party[slot] = {
    species: caught.species,
    moves: ["", "", "", ""],
    ability: caught.ability || "",
    item: ""
  };

  saveState();
  renderParty();
  showTab("party");
}

// ==================== COVERAGE TAB ====================
function initTypeDropdowns() {
  const type1 = document.getElementById('custom-type1');
  const type2 = document.getElementById('custom-type2');

  Object.keys(TYPE_CHART).forEach(t => {
    const opt1 = document.createElement('option');
    opt1.value = t;
    opt1.textContent = t;
    type1.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = t;
    opt2.textContent = t;
    type2.appendChild(opt2);
  });
}

function getPartyMoveData() {
  const moves = [];

  state.party.forEach(pkm => {
    if (!Array.isArray(pkm.moves)) return;

    pkm.moves.forEach(moveName => {
      if (!moveName) return;

      const moveObj = window.MOVES_LIST.find(m => m.name === moveName);
      if (moveObj) {
        moves.push({
          ...moveObj,
          pokemon: pkm.species
        });
      }
    });
  });

  return moves;
}

// Render the full type chart
// Render type chart based on party moves
function renderTypeChartFromParty() {
  const grid = document.getElementById('coverage-grid');
  grid.innerHTML = '';

  // Gather all moves from the party (as real move objects)
  const partyMoves = getPartyMoveData();

  // For each defending type
  Object.keys(TYPE_CHART).forEach(defType => {
    const cell = document.createElement('div');
    cell.classList.add('type-cell');
    cell.textContent = defType;

    // Find which party moves are super effective against this type
    const effectiveMoves = partyMoves
    .map(mv => {
        const multiplier = TYPE_CHART[mv.type]?.[defType] ?? 1;
        return {
        name: mv.name,
        type: mv.type,
        multiplier,
        pokemon: mv.pokemon
        };
    })

      .filter(m => m.multiplier > 1)
      .sort((a, b) => b.multiplier - a.multiplier);

    // Determine color by strongest effectiveness
    const maxMultiplier = effectiveMoves[0]?.multiplier ?? 1;

    if (maxMultiplier >= 2) {
    cell.style.backgroundColor = '#6ef36eff'; // light green
    } else if (maxMultiplier === 1) {
    cell.style.backgroundColor = '#fff3a0'; // yellow
    } else if (maxMultiplier === 0.5) {
    cell.style.backgroundColor = '#f2b6b6'; // red
    } else {
    cell.style.backgroundColor = '#eeeeee'; // neutral / fallback
    }

    // Tooltip showing party moves that are super effective
    cell.addEventListener('mouseenter', () => {
      const tooltip = document.getElementById('coverage-tooltip');
      tooltip.style.display = 'block';
      tooltip.innerHTML = effectiveMoves.length
        ? effectiveMoves
            .map(m => `
                <div class="coverage-row">
                <strong>${m.pokemon}</strong> – ${m.name} (${m.multiplier}x)
                </div>
            `)
            .join('')
        : '<div class="coverage-row muted">No supereffective party moves</div>';

    });
    cell.addEventListener('mouseleave', () => {
      document.getElementById('coverage-tooltip').style.display = 'none';
    });

    grid.appendChild(cell);
  });
}

// ------------------ DAMAGE CALC TAB ------------------
function populateCalcDropdowns() {
  const atk = document.getElementById("calc-attacker");
  const def = document.getElementById("calc-defender");
  const mv = document.getElementById("calc-move");

  atk.innerHTML = "";
  def.innerHTML = "";
  mv.innerHTML = "";

  state.dex.pokemon.forEach((p, i) => {
    const optAtk = document.createElement("option");
    optAtk.value = p.name;
    optAtk.textContent = p.name;
    atk.appendChild(optAtk);

    const optDef = document.createElement("option");
    optDef.value = p.name;
    optDef.textContent = p.name;
    def.appendChild(optDef);
  });

  state.dex.moves.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.name;
    opt.textContent = m.name;
    mv.appendChild(opt);
  });

}

function populateCalcExtras() {
  const abilitySel = document.getElementById("calc-ability");
  const itemSel = document.getElementById("calc-item");

  if (!abilitySel || !itemSel) return;

  abilitySel.innerHTML = `<option value="">-- None --</option>`;
  itemSel.innerHTML = `<option value="">-- None --</option>`;

  state.dex.abilities.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    abilitySel.appendChild(opt);
  });

  state.dex.items.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    itemSel.appendChild(opt);
  });
}

function showTab(id) {
  document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "party") renderParty();
  if (id === "caught") renderCaught();
  if (id === "coverage") {
    renderTypeChartFromParty();
  }
  if (id === "damage") {
    populateCalcDropdowns();
    populateCalcExtras(); // <-- abilities & items
  }
}

// Nature multipliers
const NATURES = {
  neutral: { atk: 1, def: 1, spAtk: 1, spDef: 1, speed: 1 },
  adamant: { atk: 1.1, def: 1, spAtk: 0.9, spDef: 1, speed: 1 },
  bashful: { atk: 1, def: 1, spAtk: 1, spDef: 1, speed: 1 },
  bold: { atk: 0.9, def: 1.1, spAtk: 1, spDef: 1, speed: 1 },
  brave: { atk: 1.1, def: 1, spAtk: 1, spDef: 1, speed: 0.9 },
  calm: { atk: 0.9, def: 1, spAtk: 1, spDef: 1.1, speed: 1 },
  careful: { atk: 0.9, def: 1, spAtk: 1, spDef: 1.1, speed: 1 },
  docile: { atk: 1, def: 1, spAtk: 1, spDef: 1, speed: 1 },
  gentle: { atk: 0.9, def: 1, spAtk: 1, spDef: 1.1, speed: 1 },
  hardy: { atk: 1, def: 1, spAtk: 1, spDef: 1, speed: 1 },
  hasty: { atk: 1, def: 0.9, spAtk: 1, spDef: 1, speed: 1.1 },
  impish: { atk: 1, def: 1.1, spAtk: 0.9, spDef: 1, speed: 1 },
  jolly: { atk: 1, def: 1, spAtk: 0.9, spDef: 1, speed: 1.1 },
  lax: { atk: 1, def: 1.1, spAtk: 1, spDef: 0.9, speed: 1 },
  lonely: { atk: 1.1, def: 0.9, spAtk: 1, spDef: 1, speed: 1 },
  mild: { atk: 1, def: 0.9, spAtk: 1.1, spDef: 1, speed: 1 },
  modest: { atk: 0.9, def: 1, spAtk: 1.1, spDef: 1, speed: 1 },
  naive: { atk: 1, def: 1, spAtk: 1, spDef: 0.9, speed: 1.1 },
  naughty: { atk: 1.1, def: 1, spAtk: 0.9, spDef: 1, speed: 1 },
  quiet: { atk: 0.9, def: 1, spAtk: 1.1, spDef: 1, speed: 1 },
  rash: { atk: 1, def: 1, spAtk: 1.1, spDef: 0.9, speed: 1 },
  relaxed: { atk: 1, def: 1.1, spAtk: 0.9, spDef: 1, speed: 0.9 },
  sassy: { atk: 1, def: 1.1, spAtk: 0.9, spDef: 1, speed: 1 },
  serious: { atk: 1, def: 1, spAtk: 1, spDef: 1, speed: 1 },
  timid: { atk: 0.9, def: 1, spAtk: 1, spDef: 1, speed: 1.1 }
};

function calculateStat(base, iv, ev, level, natureMultiplier, stage, isHP=false) {
  let total;
  if(isHP){
    total = Math.floor(((2*base + iv + Math.floor(ev/4))*level)/100) + level + 10;
  } else {
    total = Math.floor((Math.floor(((2*base + iv + Math.floor(ev/4))*level)/100) + 5) * natureMultiplier);
    total = Math.floor(total * stageMultiplier(stage));
  }
  return total;
}

// Update all stats for a Pokémon
function updateStats(pokemonPrefix){
  const level = parseInt(document.getElementById(`calc-level-${pokemonPrefix}`).value);
  const nature = document.getElementById(`calc-nature-${pokemonPrefix}`).value;

  const natureData = NATURES[nature] || NATURES.neutral;

  const natureMultiplier = natureMap[nature] || 1;
    natureData.atk
    natureData.spAtk
    natureData.def
    natureData.spDef
    natureData.speed

  const stats = ["hp","atk","def","spatk","spdef","speed"];
  stats.forEach(stat=>{
    const base = parseInt(document.getElementById(`base-${stat}-${pokemonPrefix}`).textContent);
    const iv = parseInt(document.getElementById(`iv-${stat}-${pokemonPrefix}`).value);
    const ev = parseInt(document.getElementById(`ev-${stat}-${pokemonPrefix}`).value);
    const stage = document.getElementById(`stage-${stat}-${pokemonPrefix}`) ? document.getElementById(`stage-${stat}-${pokemonPrefix}`).value : 0;

    const total = calculateStat(base, iv, ev, level, natureMultiplier, stage, stat==="hp");
    document.getElementById(`total-${stat}-${pokemonPrefix}`).textContent = total;
  });
}

// Stat stage multipliers
function stageMultiplier(stage) {
  if (stage >= 0) return (2 + stage) / 2;
  return 2 / (2 - stage);
}

// Calculate stats
function calcStat(base, level, iv = 31, ev = 0, nature = 1, isHP = false) {
  if (isHP) {
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  } else {
    return Math.floor((((2 * base + iv + Math.floor(ev / 4)) * level) / 100 + 5) * nature);
  }
}

// Full damage calculation
function calculateDamagePercent(attackerName, defenderName, moveName) {
  const atkMon = state.dex.pokemon.find(p => p.name === attackerName);
  const defMon = state.dex.pokemon.find(p => p.name === defenderName);
  const move = state.dex.moves.find(m => m.name === moveName);

  if (!atkMon || !defMon || !move) return null;

  // --- Attacker ---
  const levelAtk = parseInt(document.getElementById("calc-level-atk").value) || 50;
  const natureAtk = NATURES[document.getElementById("calc-nature-atk").value] || NATURES.neutral;

  const atkIVs = {
    hp: parseInt(document.getElementById("iv-hp-atk")?.value) || 31,
    atk: parseInt(document.getElementById("iv-atk-atk")?.value) || 31,
    def: parseInt(document.getElementById("iv-def-atk")?.value) || 31,
    spAtk: parseInt(document.getElementById("iv-spatk-atk")?.value) || 31,
    spDef: parseInt(document.getElementById("iv-spdef-atk")?.value) || 31,
    speed: parseInt(document.getElementById("iv-speed-atk")?.value) || 31
  };
  const atkEVs = {
    hp: parseInt(document.getElementById("ev-hp-atk")?.value) || 0,
    atk: parseInt(document.getElementById("ev-atk-atk")?.value) || 0,
    def: parseInt(document.getElementById("ev-def-atk")?.value) || 0,
    spAtk: parseInt(document.getElementById("ev-spatk-atk")?.value) || 0,
    spDef: parseInt(document.getElementById("ev-spdef-atk")?.value) || 0,
    speed: parseInt(document.getElementById("ev-speed-atk")?.value) || 0
  };
  const stageAtk = parseInt(document.getElementById("stage-atk")?.value) || 0;
  const stageSpAtk = parseInt(document.getElementById("stage-spatk")?.value) || 0;

  // --- Defender ---
  const levelDef = parseInt(document.getElementById("calc-level-def").value) || 50;
  const natureDef = NATURES[document.getElementById("calc-nature-def").value] || NATURES.neutral;

  const defIVs = {
    hp: parseInt(document.getElementById("iv-hp-def")?.value) || 31,
    atk: parseInt(document.getElementById("iv-atk-def")?.value) || 31,
    def: parseInt(document.getElementById("iv-def-def")?.value) || 31,
    spAtk: parseInt(document.getElementById("iv-spatk-def")?.value) || 31,
    spDef: parseInt(document.getElementById("iv-spdef-def")?.value) || 31,
    speed: parseInt(document.getElementById("iv-speed-def")?.value) || 31
  };
  const defEVs = {
    hp: parseInt(document.getElementById("ev-hp-def")?.value) || 0,
    atk: parseInt(document.getElementById("ev-atk-def")?.value) || 0,
    def: parseInt(document.getElementById("ev-def-def")?.value) || 0,
    spAtk: parseInt(document.getElementById("ev-spatk-def")?.value) || 0,
    spDef: parseInt(document.getElementById("ev-spdef-def")?.value) || 0,
    speed: parseInt(document.getElementById("ev-speed-def")?.value) || 0
  };
  const stageDef = parseInt(document.getElementById("stage-def")?.value) || 0;
  const stageSpDef = parseInt(document.getElementById("stage-spdef")?.value) || 0;

  // --- Actual stats with nature and stages ---
  const atkStat = move.category === "Physical" ?
    calcStat(atkMon.baseAtk, levelAtk, atkIVs.atk, atkEVs.atk, natureAtk.atk) * stageMultiplier(stageAtk) :
    calcStat(atkMon.baseSpAtk, levelAtk, atkIVs.spAtk, atkEVs.spAtk, natureAtk.spAtk) * stageMultiplier(stageSpAtk);

  const defStat = move.category === "Physical" ?
    calcStat(defMon.baseDef, levelDef, defIVs.def, defEVs.def, natureDef.def) * stageMultiplier(stageDef) :
    calcStat(defMon.baseSpDef, levelDef, defIVs.spDef, defEVs.spDef, natureDef.spDef) * stageMultiplier(stageSpDef);

  const defenderHP = calcStat(defMon.baseHP, levelDef, defIVs.hp, defEVs.hp, 1, true);

  // --- STAB ---
  const stab = atkMon.types.includes(move.type) ? 1.5 : 1;

  // --- Type effectiveness ---
  let effectiveness = 1;
  defMon.types.forEach(t => {
    effectiveness *= TYPE_CHART[move.type]?.[t] || 1;
  });

  // --- Weather ---
  const weather = document.getElementById("calc-weather")?.value;
  if (weather === "rain") {
    if (move.type === "Water") effectiveness *= 1.5;
    if (move.type === "Fire") effectiveness *= 0.5;
  } else if (weather === "sun") {
    if (move.type === "Fire") effectiveness *= 1.5;
    if (move.type === "Water") effectiveness *= 0.5;
  }

  // --- Terrain ---
  const terrain = document.getElementById("calc-terrain")?.value;
  let terrainMult = 1;
  if ((terrain === "electric" && move.type === "Electric") ||
      (terrain === "grassy" && move.type === "Grass") ||
      (terrain === "psychic" && move.type === "Psychic") ||
      (terrain === "misty" && move.type === "Fairy")) terrainMult = 1.3;

  // --- Base damage ---
  const base = Math.floor(((2 * levelAtk / 5 + 2) * move.power * (atkStat / defStat)) / 50 + 2);

  // --- Damage ranges ---
  const minNormal = Math.floor(base * stab * effectiveness * 0.85 * terrainMult);
  const maxNormal = Math.floor(base * stab * effectiveness * 1 * terrainMult);
  const minCrit = Math.floor(minNormal * 1.5);
  const maxCrit = Math.floor(maxNormal * 1.5);

  return {
    normal: { 
      minPercent: Math.min((minNormal / defenderHP) * 100, 100).toFixed(1),
      maxPercent: Math.min((maxNormal / defenderHP) * 100, 100).toFixed(1)
    },
    crit: {
      minPercent: Math.min((minCrit / defenderHP) * 100, 100).toFixed(1),
      maxPercent: Math.min((maxCrit / defenderHP) * 100, 100).toFixed(1)
    },
    critChance: "6.25%"
  };
}

// Run calculation and display
function runCalc() {
  const attacker = document.getElementById("calc-attacker").value;
  const defender = document.getElementById("calc-defender").value;
  const move = document.getElementById("calc-move").value;

  if (!attacker || !defender || !move) return;

  const result = calculateDamagePercent(attacker, defender, move);
  if (!result) return;

  document.getElementById("calc-result").innerHTML =
    `Damage: ${result.normal.minPercent}% - ${result.normal.maxPercent}%<br>` +
    `Critical: ${result.crit.minPercent}% - ${result.crit.maxPercent}% (Crit chance: ${result.critChance})`;
}

function pickLikelyMove(pokemonIndex, opponentTypes) {
  const moves = state.party[pokemonIndex].moves.filter(m => m); // remove empty
  if (moves.length === 0) return null;

  // naive scoring: STAB * Type effectiveness * Base power
  let bestScore = 0;
  let bestMove = moves[0];

  moves.forEach(m => {
    const moveData = state.dex.moves.find(x => x.name === m); // move data file with type & power
    if (!moveData) return;

    let score = moveData.power || 50;

    // STAB
    const monType = state.dex.pokemon[pokemonIndex].types[0]; // first type
    if (moveData.type === monType) score *= 1.5;

    // Type effectiveness
    opponentTypes.forEach(t => {
      const eff = TYPE_CHART[moveData.type]?.[t] || 1;
      score *= eff;
    });

    if (score > bestScore) {
      bestScore = score;
      bestMove = m;
    }
  });

  return bestMove;
}

// ------------------ INIT ------------------
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  hydrateDex();
  init();
});

function init() {

  loadState();
  hydrateDex();
  populateDex();
  populateDatalists();
  populateRouteDropdown();
  populateCaughtDropdowns();
  initTypeDropdowns();
  renderTypeChartFromParty();
  renderDatalists();
  renderParty();
  renderCaught();
  showTab("home");
}
