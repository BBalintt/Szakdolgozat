// Korábban megjelenített hangkártyák törlése
export function clearNoteCards() {
  const cards = document.getElementsByClassName("note-card");
  Array.from(cards).forEach(elem => elem.remove());
}

// A furulya szerkesztéséhez szükséges konténer létrehozása
export function createFurulyaContainer(recorders, recorderName) {
  const oldDiv = document.getElementById("furulya");
  if (oldDiv) oldDiv.remove();

  const item = document.createElement("div");
  item.id = "furulya";
  item.innerHTML = `<div class="container"></div>`;

  const row = item.querySelector(".container");
  row.className = "row";

  const recorder = recorders.find(element => element.RecorderID === recorderName);

  if (recorder) {
    document.getElementById("formContainer").appendChild(item);
  }

  return row;
}

// Furulyák betöltése a legördülő listába
export function fillRecorderDropdown(arr) {
  localStorage.setItem("recorders", JSON.stringify(arr));

  const options = document.getElementById("chooserec");
  const was = [];

  arr.forEach(element => {
    if (was.includes(element.RecorderID)) return;

    options.innerHTML += `
      <option value="${element.RecorderID}">
        ${element.RecorderID}
      </option>
    `;

    was.push(element.RecorderID);
  });
}