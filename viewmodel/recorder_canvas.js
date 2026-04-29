import { drawNote } from "./note_utils.js";

// Hang kirajzolása canvas elemre
export function drawNoteCanvas(data) {
  const canvasList = document.getElementsByClassName("Canvas" + data.note);
  const canvas = canvasList[canvasList.length - 1];

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  drawStaff(ctx);

  const note = drawNote(data);

  drawNoteHead(ctx, note);
  drawLedgerLines(ctx, note);
  drawAccidental(ctx, note);
}

// Ötvonalas kotta vonalainak kirajzolása
function drawStaff(ctx) {
  ctx.beginPath();

  for (let i = 0; i < 5; i++) {
    ctx.moveTo(0, 30 + i * 10);
    ctx.lineTo(100, 30 + i * 10);
  }

  ctx.strokeStyle = "black";
  ctx.stroke();
}

// Hangfej kirajzolása
function drawNoteHead(ctx, note) {
  ctx.beginPath();
  ctx.arc(50, note.octav, 7, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
}

// Pótvonalak kirajzolása szükség esetén
function drawLedgerLines(ctx, note) {
  if (note.octav > 75) {
    for (let i = 80; i <= note.octav; i += 10) {
      drawLedgerLine(ctx, i);
    }
  }
  else if (note.octav < 25) {
    for (let i = 20; i >= note.octav; i -= 10) {
      drawLedgerLine(ctx, i);
    }
  }
}

// Egy pótvonal kirajzolása
function drawLedgerLine(ctx, y) {
  ctx.beginPath();
  ctx.moveTo(37, y);
  ctx.lineTo(63, y);
  ctx.strokeStyle = "black";
  ctx.stroke();
}

// Módosítójel kirajzolása
function drawAccidental(ctx, note) {
  if (note.accidentals == null) return;

  ctx.font = "25px Arial";
  ctx.fillStyle = "black";

  if (!note.accidentals) {
    ctx.fillText("♭", 25, note.octav + 5);
  }
  else {
    ctx.fillText("♯", 25, note.octav + 7);
  }
}