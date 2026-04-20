export function authenticate() {
  alert("Kérem jelentkezzen be vagy regisztráljon a folytatáshoz!");
  document.getElementById("loginForm").addEventListener("submit", function(e) {
      e.preventDefault()
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      fetch('../model/database.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({action: 'login', username, password })
      })
      .then(res => res.json())
      .then(data => {
          if (data.success) {
              alert("Sikeres bejelentkezés!");
              location.reload();
          } else {
              alert("Hiba: " + data.error);
          }
      });
  });

  document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("reg_username").value;
    const password = document.getElementById("reg_password").value;

    fetch('../model/database.php', {
      action: 'register',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Sikeres regisztráció!");
      } else {
        alert("Hiba: " + data.error);
      }
    });
  });
}