// Aktuális autentikációs mód (bejelentkezés / regisztráció)
export let authMode = "login";

export function authenticate() {
  // Űrlap elküldésének kezelése (alapértelmezett submit tiltása)
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Felhasználói adatok kiolvasása
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Backend hívás autentikációs céllal
    fetch('../model/database.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include', // session cookie-k küldése
      body: JSON.stringify({
        action: authMode === "login" ? "login" : "register",
        username,
        password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Sikeres bejelentkezés → főoldalra irányítás
        if (authMode === "login") {
          window.location.href = "../index.php";
        } else {
          // Sikeres regisztráció visszajelzés
          alert("Sikeres regisztráció!");
        }
      } else {
        // Hibaüzenet megjelenítése
        alert("Hiba: " + data.error);
      }
    });
  });
}

export function changeAuth() {
  // UI elemek referenciái
  const title = document.getElementById("authTitle");
  const button = document.getElementById("authButton");
  const toggleButton = document.getElementById("authToggle");

  // Nézet váltása login és register között
  if (authMode === "login") {
    authMode = "register";
    title.innerText = "Regisztráció";
    button.innerText = "Regisztráció";
    toggleButton.innerText = "Már van fiókom";
  } else {
    authMode = "login";
    title.innerText = "Bejelentkezés";
    button.innerText = "Bejelentkezés";
    toggleButton.innerText = "Még nincs fiókom";
  }
}

export function signout() {
  // Kijelentkezési kérés a backend felé
  fetch('/furulyatar/model/database.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({ action: 'logout' })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Admin oldalakról visszairányítás, egyébként frissítés
      if(!location.href.includes('fingerings') && !location.href.includes('recorders')) {
        location.reload();
      } else {
        location.href='/furulyatar/index.php';
      }
    } else {
      alert("Hiba a kijelentkezés során: " + data.error);
    }
  });
}