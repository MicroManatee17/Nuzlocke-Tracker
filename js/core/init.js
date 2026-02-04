document.addEventListener("DOMContentLoaded", () => {
  loadState();
  hydrateDex();

  populateDex();
  populateDatalists();
  populateRouteDropdown();
  populateCaughtDropdowns();
  initTypeDropdowns();

  renderParty();
  renderCaught();

  showTab("home");
});
