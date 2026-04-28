// Általános POST kérés a backend felé (JSON alapú kommunikáció)
export async function postDatabase(body) {
  const response = await fetch("../model/database.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

// Furulya leírásának lekérése
export function loadDescriptionFromServer(recorderName) {
  return postDatabase({
    action: "getDescription",
    name: recorderName
  });
}

// A furulyát létrehozó felhasználó nevének lekérése
export function loadUsernameFromServer(recorderName) {
  return postDatabase({
    action: "getUser",
    name: recorderName
  });
}

// Hangok és fogások adatainak lekérése
export function loadNoteModelFromServer(recorderName, modes) {
  return postDatabase({
    action: "noteModel",
    name: recorderName,
    modes
  });
}

// Fogás törlése
export function deleteFingeringFromServer(fingeringID) {
  return fetch("../model/database.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "deleteFingering",
      fingeringID
    })
  });
}

// Szavazat küldése egy fogásra
export function voteOnServer(value, fingeringID) {
  return fetch("../model/database.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "vote",
      fingeringID,
      value
    })
  });
}

// Új hang mentése
export function saveNoteToServer(data) {
  return fetch("../model/database.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}