// Jegykártya slider vezérlőgombok beállítása
export function setupNoteSliderButtons() {
  const slider = document.getElementById("noteSlider");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Ha bármelyik elem hiányzik, kilépünk
  if (!slider || !prevBtn || !nextBtn) return;

  // Balra és jobbra léptetés eseménykezelők
  prevBtn.onclick = () => moveSlider(slider, -1);
  nextBtn.onclick = () => moveSlider(slider, 1);
}

// Slider mozgatása egy kártyányi távolsággal
function moveSlider(slider, direction) {
  const card = slider.querySelector(".note-card");
  if (!card) return;

  // Egy kártya szélessége (kis ráhagyással)
  const width = card.getBoundingClientRect().width + 3;

  // Maximális görgetési távolság
  const maxScroll = slider.scrollWidth - slider.clientWidth;

  if (direction < 0) {
    // Ha az elején járunk, visszaugrás a végére
    if (slider.scrollLeft <= 0) {
      slider.scrollLeft = maxScroll;
    } else {
      slider.scrollBy({ left: -width, behavior: "smooth" });
    }
  } else {
    // Ha a végén járunk, visszaugrás az elejére
    if (slider.scrollLeft >= maxScroll - 1) {
      slider.scrollLeft = 0;
    } else {
      slider.scrollBy({ left: width, behavior: "smooth" });
    }
  }
}