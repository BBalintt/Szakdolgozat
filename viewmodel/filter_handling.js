// Szűrő felület inicializálása (reputáció slider kezelése)
export function initFilterUI() {
  const reputationOutput = document.getElementById("reputationValue");
  const reputationSlider = document.getElementById("MinReputation");

  // Ellenőrzés: szükséges elemek léteznek-e
  if (!reputationOutput || !reputationSlider) {
    console.error("A slider elemei nem találhatók.");
    return;
  }

  // A slider aktuális értékének megjelenítése
  function updateReputationValue() {
    reputationOutput.textContent = reputationSlider.value;
  }

  // Érték frissítése csúszka mozgatásakor
  reputationSlider.addEventListener("input", updateReputationValue);

  // Kezdeti érték beállítása
  updateReputationValue();
}