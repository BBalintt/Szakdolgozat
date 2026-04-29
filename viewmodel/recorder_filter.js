import { initFilterUI } from "../viewmodel/filter_handling.js";

// Szűrő felület betöltése és inicializálása
export async function loadFilter() {
  try {
    const response = await fetch("../view/layouts/filter.html");
    const html = await response.text();

    document.getElementById("filter").innerHTML = html;

    initFilterUI();
  }
  catch (err) {
    console.error("Hiba a betöltésnél:", err);
  }
}

// Hangkártyák szűrése szín és minimális reputáció alapján
export function useFilter() {
  Array.from(document.getElementsByClassName("color-card")).forEach(elem => {
    Array.from(document.getElementsByClassName(elem.id)).forEach(card => {
      const isColorFiltered = elem.querySelector("input").checked;
      const reputationTooLow =
        parseInt(card.dataset.value) <
        parseInt(document.getElementById("MinReputation").value);

      if (isColorFiltered || reputationTooLow) {
        card.style.width = 0;

        card.childNodes.forEach(element => {
          element.style.visibility = "hidden";
          element.dataset.hidden = true;
        });

        card.style.visibility = "hidden";
      }
      else {
        card.style.width = "";

        card.childNodes.forEach(element => {
          element.style.visibility = "visible";
          element.dataset.hidden = false;
        });

        card.style.visibility = "visible";
      }
    });
  });
}