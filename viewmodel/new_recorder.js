function holeInput() {
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

function saveRecorder() {
  if(document.getElementById('name').value.trim('')!='')
  {
    const pipeCount = parseInt(document.getElementById('pipe_number').value);
    for (let i = 0; i < pipeCount; i++) {
      fetch('../model/database.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'recorderRepository',
          RecorderID: document.getElementById('name').value,
          holecount: document.getElementById('holes'+(i+1)).value
        })
      })
      .then(response => {
        if (response.ok) {
          alert('Furulya mentve!');
        } else {
          return response.text().then(text => {
            console.error('Hiba a mentés során:', response.status, text);
          });
        }
      })
      .catch(error => {
        console.error('Fetch hiba:', error);
      });
    }
  }
  else {
    alert('Kérlek add meg a furulya típusát!');
  }
}