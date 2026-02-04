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