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