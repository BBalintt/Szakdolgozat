window.playNote = playNote;

import { fingerActions, setRecorder, setSpace, rendererNull, rendererFull } from "../viewmodel/three_scene.js";

let recorderName = ''

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const fingerings = document.getElementsByClassName("fingeringCard");
const container = document.getElementById("noteContainer");
const slider = document.getElementById("noteSlider");
const form = document.getElementById("formContainer");

export function cover(elem) {
  let state = parseInt(elem.dataset.state);
  state = (state + 1) % 3;
  elem.dataset.state = state;

  elem.classList.remove('btn0', 'btn1', 'btn2');
  elem.classList.add('btn' + state);
}

export function load2DRec(arr) {
  localStorage.setItem('recorders', JSON.stringify(arr));
  let options = document.getElementById('chooserec');
  let was = [];
  arr.forEach(element => {
    if (was.includes(element['RecorderID'])) return;
    options.innerHTML += `<option value="${element['RecorderID']}">${element['RecorderID']}</option>`;
    was.push(element['RecorderID']);
  });
}

export function changeView() {
  const checkbox = document.getElementById('recorderToggle');
  if (checkbox.checked) {
    rendererFull();
    form.style.height = "10%";
    slider.style.height = "80%";
    container.style.height = "30%";

    for (let fingering of fingerings) {
      fingering.style.height = "0%";
      fingering.style.visibility = "hidden";
    }
  } else {
    rendererNull();
    form.style.height = "10%";
    slider.style.height = "100%";
    container.style.height = "85%";
    container.style.marginTop = "0%";

    for (let fingering of fingerings) {
      fingering.style.height = "100%";
      fingering.style.visibility = "visible";
    }
  }
}

export function load3DRec(modes) {

  const cards = document.getElementsByClassName("note-card")
  Array.from(cards).forEach(elem => { elem.remove(); });

  const raw = localStorage.getItem("recorders");
  const arr = raw ? JSON.parse(raw) : [];

  const options = document.getElementById("chooserec");
  if (!options || !arr.length) return;

  let pipeCount = 0;
  let div = document.getElementById('furulya');
  let holes = 0;
  if (div) {
    div.remove();
  }

  arr.forEach(element => {
    if (element['RecorderID'] === options.value) {
      recorderName = element['RecorderID'];
      pipeCount = pipeCount + 1;
    }
  });

  if(modes == 0) {
    {
      const checkFileExists = async (url) => {
        try {
          const response = await fetch(url, {
            method: 'GET',
            redirect: 'manual'
          });

          return response.status === 200;
        } catch {
          return false;
        }
      };

      const path = `./resources/${recorderName}.glb`;

      checkFileExists(path).then(exists => {
        if (exists) {
          setSpace();
          setRecorder(recorderName);
          rendererNull();
          const sw = document.getElementById('switch');
          if (sw)
          {
            sw.onclick = () => 
            {          
              changeView();
            }
          }
          else {
            const item = document.createElement('label');
            item.id = "switch";
            item.innerHTML = `<input type="checkbox" id="recorderToggle" class="recorderToggle"  onclick="changeView()"><span class="slider round"></span>`;
            item.className = "justify-content-end";
            var nav = document.getElementById("navbar");
            nav.appendChild(item);
          }
        } 
        else {
          const item = document.getElementById('recorderToggle');
          if (item) item.remove();
          rendererNull();
          console.log("A furulyához nincs 3d-s modell nem található.");

          form.style.height = "10%";
          slider.style.height = "100%";
          container.style.height = "85%";
          container.style.marginTop = "10%";

          for (let fingering of fingerings) {
            fingering.style.height = "100%";
            fingering.style.visibility = "visible";
          }
        }
      })
    }
  }

  const item = document.createElement('div');
  item.id = 'furulya';
  item.innerHTML = `<div class="container"></div>`;
  let row = item.querySelector('.container');
  row.className = 'row';
  arr.forEach(element => {
    if (element['RecorderID'] === options.value) {
      holes = element['holecount'];
      document.getElementById('fo').appendChild(item);
      return;
    }
  });
  fetch('../model/database.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action: 'noteModel', name: options.value, modes: modes })
  })
    .then(response => response.json())
    .then(data => {
      //,C;C;c;c'
      const baseOrder = ["C", "D", "E", "F", "G", "A", "H"];

      function noteValue(note) {
        let octave = 0;
        let accidental = 0;

        if (note.includes(",")) octave -= 1;
        if (note.includes("'")) octave += 1;

        if (note.includes("b")) accidental = -1;
        if (note.includes("#")) accidental = 1;

        const match = note.match(/[CDEFGHA]/);
        const base = match ? match[0] : note;

        return octave * 100 + baseOrder.indexOf(base) * 10 + accidental;
      }

      data.data.sort((a, b) => {
        return noteValue(a.note) - noteValue(b.note);
      });

      data.data.forEach((data, idx) => {
        holes = data.holecount;
        let fingeringBase3;
        let padded;
        if(modes == 0) {
          fingeringBase3 = data.fingering.toString(3);
          padded = fingeringBase3.padStart(holes, '0').split('').reverse().join('');
        }
        const col = document.createElement('div');
        col.className = `col-${12 / pipeCount} furulya`;
        const track = document.getElementById("noteTrack");
        const card = document.createElement("div");
        const fingering = document.createElement("div");
        card.className = "note-card card";
        fingering.className = "fingeringCard";
        for (let j = 0; j < holes; j++) {

          if (modes == 0) {
            fingering.innerHTML += `
            <div class="row justify-content-center">
            <input type="button" class="me-1 col-12 covering btn`+ padded[j] + `" data-state="` + padded[j] + `">
            </div>
          `;
          }
          else if (modes == 1) {
            col.innerHTML += `
            <div class="row justify-content-center">
            <input type="button" class="me-1 col-12 covering btn0" data-state="0" onclick="cover(this)">
            </div>
          `;
          }
        }
        card.appendChild(fingering);
        card.innerHTML += "</div>";
        if (modes == 0) {

          card.innerHTML += `
              <div class="card-body text-center">
                <canvas class="Canvas${data.note}" width="100" height="100" style="border:1px solid grey"></canvas>
                
                <p class="fs-4 mb-3">${data.note}</p>
                <button class="btn btn-primary" onclick="playNote('${padded}','${data.note.replace(/'/g, "\\'")}')">▶ Play</button>
              </div>
            `;
          track.appendChild(card);
          const c = document.getElementsByClassName("Canvas" + data.note);
          const ctx = c[c.length - 1].getContext("2d");
          ctx.beginPath();
          for (var i = 0; i < 5; i++) {
            ctx.moveTo(0, 30 + i * 10);
            ctx.lineTo(100, 30 + i * 10);
          }
          ctx.strokeStyle = "black";
          ctx.stroke();
          ctx.beginPath();
          let octav = 0;
          let note = 0;
          let accidentals = null;
          for (let i = 0; i < data.note.length; i++) {
            if (data.note[i] === ",") octav += 35;
            else if (data.note[i] === "'") octav -= 35;
            else if (data.note[i] === "#") accidentals = true;
            else if (data.note[i] === "b") accidentals = false;
            else note = data.note[i];
          }
          switch (note) {
            case "C":
              octav = octav + 80;
              break;
            case "D":
              octav = octav + 75;
              break;
            case "E":
              octav = octav + 70;
              break;
            case "F":
              octav = octav + 65;
              break;
            case "G":
              octav = octav + 60;
              break;
            case "A":
              octav = octav + 55;
              break;
            case "H":
              octav = octav + 50;

              break;
          }
          ctx.arc(50, octav, 7, 0, 2 * Math.PI);
          ctx.strokeStyle = "black";
          ctx.fillStyle = "black";
          ctx.fill();
          ctx.stroke();

          if (octav > 75) {
            for (var i = 80; i <= octav; i += 10) {
              ctx.beginPath();
              ctx.moveTo(37, i);
              ctx.lineTo(63, i);
              ctx.strokeStyle = "black";
              ctx.stroke();
            }
          }
          if (octav < 25) {
            for (var i = 20; i >= octav; i -= 10) {
              ctx.beginPath();
              ctx.moveTo(37, i);
              ctx.lineTo(63, i);
              ctx.strokeStyle = "black";
              ctx.stroke();
            }
          }

          if (accidentals != null) {
            console.log("A módosító:", accidentals);

            ctx.font = "25px Arial";
            ctx.fillStyle = "black";

            if (!accidentals) {
              ctx.fillText("♭", 25, octav + 5);
            }

            if (accidentals) {
              ctx.fillText("♯", 25, octav + 7);
            }
          }
          const slider = document.getElementById("noteSlider");
          document.getElementById("prevBtn").onclick = () => {
            const card = slider.querySelector(".note-card");
            if (!card) return;

            const w = card.getBoundingClientRect().width + 3;
            const maxScroll = slider.scrollWidth - slider.clientWidth;

            if (slider.scrollLeft <= 0) {
              slider.scrollLeft = maxScroll;
            } else {
              slider.scrollBy({ left: -w, behavior: "smooth" });
            }
          };
          document.getElementById("nextBtn").onclick = () => {
            const card = slider.querySelector(".note-card");
            if (!card) return;

            const w = card.getBoundingClientRect().width + 3;
            const maxScroll = slider.scrollWidth - slider.clientWidth;

            if (slider.scrollLeft >= maxScroll - 1) {
              slider.scrollLeft = 0;
            } else {
              slider.scrollBy({ left: w, behavior: "smooth" });
            }
          };
        }
        else if (modes == 1) {
          col.innerHTML += `<div class="row"><input type="text" class="note"></div>`;
          col.innerHTML += `<div class="row"><input type="button" value="Hang mentése" onclick="saveNote()"></div>`;
        }
        row.appendChild(col);
      });
    });
}

function playNote(note, name) {
  for (let i = 0; i < note.length; i++) {
    let action;
    if (note[i] == '1') {
      action = fingerActions[note.length + i];
    }
    else {
      action = fingerActions[i];
    }
    if (action) {
      action.reset();
      if (note[i] !== '0') {
        action.timeScale = 1;
        action.play();
      } else {
        action.timeScale = -1;
        action.play();
      }
    }
  }

  let pitch = 1;
  let accidental = "";
  let freq = 0;
  name.split('').forEach(element => {
    switch (element) {
      case "C":
        freq = 523.25;
        break;
      case "D":
        freq = 587.33;
        break;
      case "E":
        freq = 659.25;
        break;
      case "F":
        freq = 698.46;
        break;
      case "G":
        freq = 783.99;
        break;
      case "A":
        freq = 880.00;
        break;
      case "H":
        freq = 987.77;
        break;
      case ",":
        pitch = pitch / 2;
        break;
      case "'":
        pitch = pitch * 2;
        break;
      case "b":
        accidental = "flat";
        break;
      case "#":
        accidental = "sharp";
        break;
    }
  });
  freq = freq * pitch;
  if (accidental == "flat") {
    freq = freq / (2 ** (1 / 12));
  }
  else if (accidental == "sharp") {
    freq = freq * (2 ** (1 / 12));
  }
  playHz(freq, 5);

}

export function saveNote() {
  document.querySelectorAll('.furulya').forEach((recorderPipe, k) => {
    let fingeringCode = '';
    recorderPipe.querySelectorAll('.covering').forEach((button) => {
      fingeringCode += button.dataset.state.toString();
    });
    fingeringCode = fingeringCode.split('').reverse().join('');
    fetch('../model/database.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'noteRepository',
        RecorderID: document.getElementById('chooserec').value,
        note: document.querySelectorAll('.note')[k].value,
        fingering: fingeringCode,
        pipe: k
      })
    })
      .then(response => {
        if (response.ok) {
          alert('Hang mentve!');
        } else {
          return response.text().then(text => {
            console.error('Hiba a mentés során:', response.status, text);
          });
        }
      })
      .catch(error => {
        console.error('Fetch hiba:', error);
      });
  });
}

function playHz(freq, duration = 1.5) {
  const now = audioCtx.currentTime;

  // --- MASTER OUTPUT & FILTER ---
  const masterGain = audioCtx.createGain();
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(1800, now); // A furulya nem "fényes" hangszer

  // --- AZ "EMBERI" MODULÁCIÓ (Jitter & Shimmer) ---
  // Ez egy láthatatlan kéz, ami rángatja a hangerőt és a frekvenciát
  const humanizer = audioCtx.createOscillator();
  const humanizerGain = audioCtx.createGain();
  humanizer.frequency.value = 3.5; // Lassú remegés
  humanizerGain.gain.value = 0.5; // Enyhe hatás

  // Egy második, gyorsabb remegés a textúrához
  const jitter = audioCtx.createOscillator();
  jitter.frequency.value = 12;
  const jitterGain = audioCtx.createGain();
  jitterGain.gain.value = 0.2;

  // --- GENERÁTOROK ---
  const oscs = [];
  const gains = [];

  // Alaphang + 2 felharmonikus (Páratlan dominancia)
  const partials = [
    { f: -1, g: 0.5, type: 'sine' },
    { f: 0, g: 0.08, type: 'sine' },
    { f: 1, g: 0.15, type: 'triangle' }
  ];

  partials.forEach((p, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    o.type = p.type;
    const detune = (Math.random() - 0.5) * 2;
    o.frequency.setValueAtTime(freq + p.f + detune, now);

    // Pitch-glide az elején (mint amikor "beugrik" a hang)
    o.frequency.exponentialRampToValueAtTime(freq + p.f, now + 0.15);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(p.g, now + 0.2); // Lassabb attack = kevésbé gépies
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Modulációk bekötése
    humanizerGain.connect(o.frequency);
    jitterGain.connect(g.gain); // A hangerő is remegjen picit!

    o.connect(g);
    g.connect(masterGain);

    o.start(now);
    o.stop(now + duration + 0.1);
  });

  humanizer.start(now);
  jitter.start(now);

  // --- MASTER ENVELOPE ---
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.8, now + 0.1);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  masterGain.connect(lowpass);
  lowpass.connect(audioCtx.destination);
}