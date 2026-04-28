import { drawNoteCanvas } from "./recorder_canvas.js";
import { setupNoteSliderButtons } from "./recorder_slider.js";

// Hangkártyák vagy szerkeszthető fogások megjelenítése
export function renderNotes(notes, modes, pipeCount, furulyaRow, username) {
  const colors = [];

  notes.forEach((data, idx) => {
    if (modes === 0) {
      renderNoteCard(data, colors, username);
    } else if (modes === 1) {
      renderEditableFingering(data, idx, furulyaRow, pipeCount);
    }
  });

  if (modes === 0) {
    setupNoteSliderButtons();
  }
}

// Egy hangkártya létrehozása
function renderNoteCard(data, colors, username) {
  const holes = data.holecount;

  const padded = data.fingering
    .toString(3)
    .padStart(holes, "0")
    .split("")
    .reverse()
    .join("");

  const card = document.createElement("div");
  card.className = `note-card card ${data.color}`;
  card.style.backgroundColor = `#${data.color}`;
  card.dataset.value = data.reputation;

  createColorFilterIfNeeded(data, colors);

  const fingering = createFingeringCard(holes, padded);
  const cardBody = createNoteCardBody(data, padded, username);

  card.appendChild(fingering);
  card.appendChild(cardBody);

  document.getElementById("noteTrack").appendChild(card);

  drawNoteCanvas(data);
}

// Fogás vizuális megjelenítése
function createFingeringCard(holes, padded) {
  const fingering = document.createElement("div");
  fingering.className = "fingeringCard";

  for (let j = 0; j < holes; j++) {
    fingering.innerHTML += `
      <div class="row justify-content-center">
        <input type="button" class="me-1 col-12 covering btn${padded[j]}" data-state="${padded[j]}">
      </div>
    `;
  }

  return fingering;
}

// Új színszűrő létrehozása, ha az adott szín még nem szerepel
function createColorFilterIfNeeded(data, colors) {
  if (colors.includes(data.color)) return;

  const colorCard = document.createElement("div");
  const colorCheckbox = document.createElement("input");

  colorCheckbox.type = "checkbox";
  colorCheckbox.checked = false;

  colorCard.id = data.color;
  colorCard.className = "color-card card";
  colorCard.innerHTML += `<p>${data.username}</p>`;
  colorCard.style.backgroundColor = `#${data.color}`;
  colorCard.appendChild(colorCheckbox);

  document.getElementById("colorTrack").appendChild(colorCard);

  colors.push(data.color);
}

// Hangkártya tartalmi részének létrehozása
function createNoteCardBody(data, padded, username) {
  const cardBody = document.createElement("div");
  cardBody.classList = "card-body text-center";

  const escapedNote = data.note.replace(/'/g, "\\'");

  cardBody.innerHTML = `
    <canvas class="Canvas${data.note}" width="100" height="100" style="border:1px solid grey"></canvas>

    <p class="fs-4 mb-3">${data.note}</p>

    <button class="btn btn-primary" onclick="animateHere('${padded}'),playNote('${escapedNote}')">
      ▶ Lejátszás
    </button>

    <div class="row">
      <button id="upvote-${data.fingering_tableID}" class="col-6" onclick="vote(1, '${data.fingering_tableID}')" style="color: green; background-color: transparent; border-color: transparent">⯅</button>
      <button id="downvote-${data.fingering_tableID}" class="col-6" onclick="vote(-1, '${data.fingering_tableID}')" style="color: red; background-color: transparent; border-color: transparent">⯆</button>
      <p>${data.username}</p>
    </div>
  `;

  if (username === data.username) {
    cardBody.innerHTML += `
      <button class="btn btn-danger" onclick="deleteFingering('${data.fingering_tableID}')">
        Törlés
      </button>
    `;
  }

  return cardBody;
}

// Új hang rögzítéséhez szükséges szerkeszthető fogás létrehozása
function renderEditableFingering(data, idx, furulyaRow, pipeCount) {
  const holes = data.holecount;

  const col = document.createElement("div");
  col.className = `col-${12 / pipeCount} furulya`;

  for (let j = 0; j < holes; j++) {
    col.innerHTML += `
      <div class="row justify-content-center">
        <input type="button" class="me-1 col-12 covering${idx} btn0" data-state="0" onclick="cover(this)">
      </div>
    `;
  }

  col.innerHTML += `
    <div class="row">
      <input type="text" class="note${idx}" oninput="inputCheck(event)">
    </div>
  `;

  col.innerHTML += `
    <div class="row">
      <input type="button" value="Hang mentése" onclick="saveNote(${idx})">
    </div>
  `;

  furulyaRow.appendChild(col);
}