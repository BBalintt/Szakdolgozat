import {
  fingerActions,
  setRecorder,
  setSpace,
  rendererNull,
  rendererFull
} from "../viewmodel/three_scene.js";

// 2D és 3D nézet közötti váltás
export function changeView() {
  const checkbox = document.getElementById("recorderToggle");
  const slider = document.getElementById("noteSlider");
  const container = document.getElementById("noteContainer");
  const form = document.getElementById("formContainer");
  const fingerings = document.getElementsByClassName("fingeringCard");

  const parent = slider.parentElement;

  if (checkbox.checked) {
    rendererFull();

    slider.style.height = parent.clientHeight * 0.5 + "px";

    // 3D nézetben a 2D fogáskártyák elrejtése
    for (let fingering of fingerings) {
      fingering.style.height = "0%";
      fingering.style.visibility = "hidden";
      fingering.childNodes.forEach(element => {
        if (element.nodeType === Node.ELEMENT_NODE) {
          element.style.visibility = "hidden";
        }
      });
    }
  }
  else {
    rendererNull();

    slider.style.height = parent.clientHeight * 2 + "px";

    // 2D nézetben a fogáskártyák visszaállítása
    for (let fingering of fingerings) {
      fingering.style.height = "100%";
      if (fingering.dataset.hidden != "true") {
        fingering.style.visibility = "visible";
        fingering.childNodes.forEach(element => {
          if (element.nodeType === Node.ELEMENT_NODE) {
            if (fingering.dataset.hidden != "true") {
              element.style.visibility = "visible";
            }
          }
        });
      }
    }
  }
}

// 3D modell előkészítése, ha tartozik modell a furulyához
export async function setupRecorderView(recorderName) {
  const sw = document.getElementById("recorderToggle");

  reset2DView();

  let modelname="";
  if(recorderName.includes('blockflöte'))
  {
    modelname='szoprán';
  }
  else if(recorderName.includes('ír_furulya'))
  {
    modelname='ír_furulya'
  }
  const path = `./resources/${modelname}.glb`;
  
  if (modelname!="") {
    setSpace();
    setRecorder(modelname);
    rendererNull();

    if (sw) {
      sw.checked = false;
      sw.onclick = () => changeView();
    }
    else {
      createRecorderToggle();
    }
  }
  else {
    if (sw) sw.remove();

    rendererNull();
    console.log("A furulyához 3d-s modell nem található.");

    showFingerings();
  }
}

// Alapértelmezett 2D megjelenítés visszaállítása
function reset2DView() {
  rendererNull();

  const slider = document.getElementById("noteSlider");
  const container = document.getElementById("noteContainer");
  const form = document.getElementById("formContainer");

  const parent = slider.parentElement;

  form.style.height = parent.clientHeight * 0.1;
  slider.style.height = parent.clientHeight * 1;
  container.style.height = parent.clientHeight * 0.75;
  container.style.marginTop = "0%";

  showFingerings();
}

// Fogások megjelenítése
function showFingerings() {
  const fingerings = document.getElementsByClassName("fingeringCard");

  for (let fingering of fingerings) {
    fingering.style.height = "100%";
    fingering.style.visibility = "visible";
  }
}

// 3D modellfájl létezésének ellenőrzése
async function checkFileExists(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual"
    });

    return response.status === 200;
  }
  catch {
    return false;
  }
}

// 2D/3D váltó létrehozása
function createRecorderToggle() {
  const item = document.createElement("label");

  item.id = "switch";
  item.className = "justify-content-end";
  item.innerHTML = `
    <input type="checkbox" id="recorderToggle" class="recorderToggle" onclick="changeView()">
    <span class="slider round"></span>
  `;

  const nav = document.getElementById("navbar");
  nav.appendChild(item);
}

// A 3D furulyamodell ujjpozícióinak animálása
export function animateHere(note) {
  let lastNote = null;

  if (localStorage.getItem("Note") !== null) {
    lastNote = localStorage.getItem("Note");
  }

  if (lastNote === null) {
    lastNote = "22222222222222222222222222222222";
  }

  for (let i = 0; i < note.length; i++) {
    let action;

    console.log("A lejátszandó hang fingeringje:", note);

    if (lastNote[i] != note[i]) {
      if (note[i] == "1") {
        action = fingerActions[note.length + i];
      }
      else {
        action = fingerActions[i];
      }

      if (action) {
        action.reset();

        if (note[i] !== "0") {
          action.timeScale = 100;
          action.play();
        }
        else {
          action.timeScale = -1;
          action.play();
        }
      }
    }
  }

  localStorage.setItem("Note", note);
}