// Hang lejátszásához szükséges segédfüggvény
import { playNote } from "./note_utils.js";

// Szerveroldali adatlekérések
import {
  loadDescriptionFromServer,
  loadUsernameFromServer,
  loadNoteModelFromServer
} from "./recorder_api.js";

// DOM-műveletek a furulya és a hangkártyák kezeléséhez
import {
  clearNoteCards,
  createFurulyaContainer,
  fillRecorderDropdown
} from "./recorder_dom.js";

// Furulyák és hangok feldolgozását segítő függvények
import {
  getRecordersFromStorage,
  sortNotes
} from "./recorder_utils.js";

import { renderNotes } from "./recorder_cards.js";
import { setupRecorderView, changeView, animateHere } from "./recorder_3d_view.js";
import { loadFilter, useFilter } from "./recorder_filter.js";
import { cover, deleteFingering, vote, saveNote, inputCheck } from "./recorder_edit.js";

let recorderName = "";

// Függvények elérhetővé tétele HTML eseménykezelők számára
window.playNote = playNote;
window.changeView = changeView;
window.animateHere = animateHere;
window.cover = cover;
window.deleteFingering = deleteFingering;
window.vote = vote;
window.saveNote = saveNote;
window.inputCheck = inputCheck;
window.useFilter = useFilter;

// Más modulok számára exportált függvények
export { fillRecorderDropdown };
export { changeView };
export { cover };
export { deleteFingering };
export { vote };
export { saveNote };
export { animateHere };
export { inputCheck };
export { useFilter };

// A kiválasztott furulya adatainak betöltése
export async function loadRec(modes) {
  if (modes === 0) {
    await loadFilter();
  }

  clearNoteCards();

  const arr = getRecordersFromStorage();
  const options = document.getElementById("chooserec");

  if (!options || !arr.length) return;

  recorderName = options.value;

  const pipeCount = arr.filter(element => element.RecorderID === recorderName).length;
  const furulyaRow = createFurulyaContainer(arr, recorderName);

  if (modes === 0) {
    await setupRecorderView(recorderName);
  }

  await loadDescription(recorderName);

  const username = await loadUsername(recorderName);

  await loadNoteModel(recorderName, modes, pipeCount, furulyaRow, username);
}

// A kiválasztott furulya leírásának betöltése
async function loadDescription(recorderName) {
  try {
    const data = await loadDescriptionFromServer(recorderName);

    const desc = document.getElementById("description");

    if (desc) {
      desc.innerHTML = data.description || "";
    }
  }
  catch (error) {
    console.error("Fetch hiba:", error);
  }
}

// A furulyát létrehozó felhasználó nevének lekérése
async function loadUsername(recorderName) {
  try {
    const data = await loadUsernameFromServer(recorderName);
    return data.username;
  }
  catch (error) {
    console.error("Fetch hiba:", error);
    return null;
  }
}

// A furulyához tartozó hangok és fogások betöltése
async function loadNoteModel(recorderName, modes, pipeCount, furulyaRow, username) {
  try {
    const data = await loadNoteModelFromServer(recorderName, modes);

    if (modes === 0) {
      sortNotes(data.data);
    }

    renderNotes(data.data, modes, pipeCount, furulyaRow, username);
  }
  catch (error) {
    console.error("Fetch hiba:", error);
  }
}