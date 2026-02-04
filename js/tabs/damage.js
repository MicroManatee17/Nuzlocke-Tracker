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