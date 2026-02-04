function showTab(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.style.display = "none";
  });

  const active = document.getElementById(id);
  if (active) active.style.display = "block";

  if (id === "party") renderParty();
  if (id === "caught") renderCaught();
  if (id === "coverage") renderTypeChartFromParty();
  if (id === "damage") {
    populateCalcDropdowns();
    populateCalcExtras();
  }
}