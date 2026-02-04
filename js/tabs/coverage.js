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