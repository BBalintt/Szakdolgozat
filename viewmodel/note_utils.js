// AudioContext létrehozása a hanggeneráláshoz
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// A hang kottaképi pozíciójának meghatározása
export function drawNote(data) {
  let octav = 0;
  let note = "";
  let accidentals = null;

  for (let i = 0; i < data.note.length; i++) {
    if (data.note[i] === ",") octav += 35;
    else if (data.note[i] === "'") octav -= 35;
    else if (data.note[i] === "#") accidentals = true;
    else if (data.note[i] === "b") accidentals = false;
    else note = data.note[i];
  }

  // Hang helyének beállítása a vonalrendszeren
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

  return { octav, accidentals };
}


// Egy adott frekvenciájú hang lejátszása
function playHz(freq, duration = 1.5) {
  const now = audioCtx.currentTime;

  // Kimeneti hangerő és szűrés
  const masterGain = audioCtx.createGain();
  const lowpass = audioCtx.createBiquadFilter();

  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(1800, now);

  // Enyhe modulációk a természetesebb hangzásért
  const humanizer = audioCtx.createOscillator();
  const humanizerGain = audioCtx.createGain();

  humanizer.frequency.value = 3.5;
  humanizerGain.gain.value = 0.5;

  const jitter = audioCtx.createOscillator();
  const jitterGain = audioCtx.createGain();

  jitter.frequency.value = 12;
  jitterGain.gain.value = 0.2;

  // Alaphang és felharmonikusok
  const partials = [
    { f: -1, g: 0.5, type: 'sine' },
    { f: 0, g: 0.08, type: 'sine' },
    { f: 1, g: 0.15, type: 'triangle' }
  ];

  partials.forEach((p) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    o.type = p.type;

    const detune = (Math.random() - 0.5) * 2;

    o.frequency.setValueAtTime(freq + p.f + detune, now);
    o.frequency.exponentialRampToValueAtTime(freq + p.f, now + 0.15);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(p.g, now + 0.2);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Modulációk kapcsolása a hangmagassághoz és hangerőhöz
    humanizerGain.connect(o.frequency);
    jitterGain.connect(g.gain);

    o.connect(g);
    g.connect(masterGain);

    o.start(now);
    o.stop(now + duration + 0.1);
  });

  humanizer.start(now);
  jitter.start(now);

  // Teljes hang burkológörbéje
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.8, now + 0.1);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  masterGain.connect(lowpass);
  lowpass.connect(audioCtx.destination);
}

// Hangnév alapján frekvencia számítása és lejátszása
export function playNote(name, playFn = playHz) {
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

  // Oktáv és módosítójel alkalmazása
  freq = freq * pitch;

  if (accidental == "flat") {
    freq = freq / (2 ** (1 / 12));
  }
  else if (accidental == "sharp") {
    freq = freq * (2 ** (1 / 12));
  }

  playFn(freq, 5);

  return { freq, accidental, pitch };
}