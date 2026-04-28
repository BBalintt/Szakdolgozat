// Furulyák lekérése a localStorage-ból
export function getRecordersFromStorage() {
  const raw = localStorage.getItem("recorders");
  return raw ? JSON.parse(raw) : [];
}

// Egy adott furulya csöveinek számának meghatározása
export function getPipeCount(recorders, recorderName) {
  return recorders
    .filter(element => element.RecorderID === recorderName)
    .length;
}

// Hangok rendezése zenei sorrend szerint
export function sortNotes(notes) {
  notes.sort((a, b) => noteValue(a.note) - noteValue(b.note));
}

// Egy hang értékké alakítása rendezéshez
function noteValue(note) {
  const baseOrder = ["C", "D", "E", "F", "G", "A", "H"];

  let octave = 0;
  let accidental = 0;

  // Oktáv módosítók kezelése
  if (note.includes(",")) octave -= 1;
  if (note.includes("'")) octave += 1;

  // Módosítójelek kezelése
  if (note.includes("b")) accidental = -1;
  if (note.includes("#")) accidental = 1;

  // Alaphang meghatározása
  const match = note.match(/[CDEFGHA]/);
  const base = match ? match[0] : note;

  // Számított érték visszaadása rendezéshez
  return octave * 100 + baseOrder.indexOf(base) * 10 + accidental;
}