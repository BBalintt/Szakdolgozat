# FurulyatáR

A **FurulyatáR** egy webalkalmazás, amely különböző furulyák fogástáblázatainak megjelenítésére és bővítésére szolgál.
A rendszer célja, hogy egy központi, könnyen használható felületen gyűjtse össze a különböző hangszerekhez tartozó fogásokat, és lehetőséget biztosítson a felhasználók számára azok szerkesztésére és értékelésére.

---

## Fő funkciók

* Furulyák kiválasztása és megjelenítése
* Fogástáblázatok böngészése és szűrése
* Új fogások rögzítése
* Felhasználói értékelés (szavazás)
* 2D és 3D megjelenítés (Three.js)
* Hangok lejátszása (Web Audio API)
* Felhasználói regisztráció és bejelentkezés

---

## Használt technológiák

### Frontend

* HTML5
* CSS3 (Bootstrap)
* JavaScript (ES6 modulok)

### Backend

* PHP
* MySQL (PDO)

### Egyéb

* Three.js (3D megjelenítés)
* Web Audio API (hanggenerálás)
* Canvas API (kottarajzolás)
* Jest (tesztelés)

---

## Architektúra

Az alkalmazás **MVVM (Model–View–ViewModel)** mintát követ:

* **Model:** adatbázis és PHP backend
* **View:** HTML + CSS felület
* **ViewModel:** JavaScript logika és adatkezelés

---

## Használat

1. Válassz egy furulyát a listából
2. Böngészd a fogásokat
3. Szűrd a találatokat értékelés vagy felhasználó alapján
4. Jelentkezz be új fogások hozzáadásához
5. Használd a 3D nézetet a vizuális megjelenítéshez

---

## Telepítés

1. Klónozd a repository-t:

   ```bash
   git clone https://github.com/BBalintt/Szakdolgozat.git
   ```

2. Állíts be egy PHP szervert (pl. XAMPP)

3. Importáld az adatbázist (MySQL)

4. Indítsd el a projektet böngészőben

---

## Tesztelés

A projekt tartalmaz egységteszteket Jest használatával:

```bash
npm install
npm test
```

---

## Licenc

A projekt egyes részei külső forrásból származnak, például:

* Three.js alapú kódok (MIT License)
* https://github.com/bobbyroe

---

## Szerző

Horváth Bálint
ELTE IK Szombathely
2026
