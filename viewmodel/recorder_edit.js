import {
  deleteFingeringFromServer,
  voteOnServer,
  saveNoteToServer
} from "./recorder_api.js";

// Lyuk állapotának váltása: szabad, félig fedett, teljesen fedett
export function cover(elem) {
  let state = parseInt(elem.dataset.state);

  state = (state + 1) % 3;
  elem.dataset.state = state;

  elem.classList.remove("btn0", "btn1", "btn2");
  elem.classList.add("btn" + state);
}

// Meglévő fogás törlése
export function deleteFingering(fingeringID) {
  if (!confirm("Biztosan törölni szeretnéd ezt a fogást?")) {
    return;
  }

  const state = {
    recorderName: document.getElementById("chooserec").value
  };

  sessionStorage.setItem("recName", JSON.stringify(state));

  deleteFingeringFromServer(fingeringID)
    .then(response => {
      if (response.ok) {
        location.reload();
      }
      else {
        console.error("Hiba a fingering törlése során.");
      }
    })
    .catch(error => {
      console.error("Fetch hiba:", error);
    });
}

// Szavazat leadása egy fogásra
export function vote(value, fingeringID) {
  voteOnServer(value, fingeringID)
    .then(response => {
      if (response.ok) {
        console.log("Szavazat sikeresen leadva.");

        const upvoteButton = document.getElementById("upvote-" + fingeringID);
        const downvoteButton = document.getElementById("downvote-" + fingeringID);

        upvoteButton.disabled = true;
        downvoteButton.disabled = true;

        upvoteButton.style.color = "#354b37";
        downvoteButton.style.color = "#4d2f2f";
      }
      else {
        console.error("Hiba a szavazat leadása során.");
      }
    })
    .catch(error => {
      console.error("Fetch hiba:", error);
    });
}

// Új hang és a hozzá tartozó fogás mentése
export function saveNote(num) {
  let fingeringCode = "";

  document.querySelectorAll(".covering" + num).forEach(button => {
    fingeringCode += button.dataset.state.toString();
  });

  fingeringCode = fingeringCode.split("").reverse().join("");
  if (document.getElementById("note" + num)?.value == undefined) {
    alert("Ismeretlen hiba");
    return;
  }
  alert(document.getElementById("note" + num)?.value);
  saveNoteToServer({
    action: "noteRepository",
    RecorderID: document.getElementById("chooserec").value,
    note: document.getElementById("note" + num)?.value || "",
    fingering: fingeringCode,
    pipe: num
  })
    .then(response => {
      if (response.ok) {
        alert("Hang mentve!");
      }
      else {
        return response.text().then(text => {
          console.error("Hiba a mentés során:", response.status, text);
        });
      }
    })
    .catch(error => {
      console.error("Fetch hiba:", error);
    });
}

// Hangnév mező ellenőrzése, csak megengedett karakterekkel
export function inputCheck(e) {
  let val = e.target.value;

  val = val.replace(/[^CDEFGAH#b',]/g, "");

  const match = val.match(/[CDEFGAH]/);

  if (match) {
    const letter = match[0];

    const rest = val
      .slice(val.indexOf(letter) + 1)
      .replace(/[CDEFGAH]/g, "");

    val = letter + rest;
  }

  e.target.value = val;
}