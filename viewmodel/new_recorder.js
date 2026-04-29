// A csövek számának megfelelő lyukszám mezők létrehozása
export function holeInput() {
  const pipeCount = parseInt(document.getElementById('pipe_number').value);
  const container = document.getElementById('holes-container');

  container.innerHTML = '';

  for (let i = 1; i <= pipeCount; i++) {
    const input = document.createElement('input');

    input.type = 'number';
    input.id = 'holes' + i;
    input.name = 'holes' + i;
    input.min = '1';
    input.value = '1';
    input.max = '9';

    container.appendChild(input);
  }
}

// Új furulya adatainak mentése
export async function saveRecorder() {
  const recorderName = document.getElementById('name').value.trim();
  if (recorderName === '') {
    alert('Kérlek add meg a furulya típusát!');
    return;
  }

  const exists = await isRecorderIDExists(
    recorderName,
    document.getElementById('description').value.trim()
  );

  if (!exists) {
    const pipeCount = parseInt(document.getElementById('pipe_number').value, 10);

    // Minden csőhöz külön rekord mentése
    for (let i = 0; i < pipeCount; i++) {
      try {        
        const response = await fetch('../model/database.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'recorderRepository',
            RecorderID: recorderName,
            holecount: document.getElementById('holes' + (i + 1)).value
          })
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Hiba a mentés során:', response.status, text);
          return;
        }
      }
      catch (error) {
        console.error('Fetch hiba:', error);
        return;
      }
    }

    alert('Furulya sikeresen mentve!');
  }
  else {
    console.log(exists);
    alert('Ez a furulya típus már létezik!');
  }
}

// Annak ellenőrzése, hogy létezik-e már az adott furulyatípus
function isRecorderIDExists(recorderID, description) {
  return fetch('../model/database.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'recorderExists',
      RecorderID: recorderID,
      description: description
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP hiba: ${response.status}`);
      }

      return response.json();
    })
    .then(data => {
      return data.exists === true;
    })
    .catch(error => {
      console.error('Fetch hiba:', error);
      return false;
    });
}