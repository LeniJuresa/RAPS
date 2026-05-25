// Čekamo da se stranica u potpunosti učita prije nego što počnemo
document.addEventListener("DOMContentLoaded", function () {

  // --- POSTAVLJANJE MAPE ---

  // Kreiramo mapu i postavljamo početni pogled na sredinu svijeta (lat 0, lon 0), zoom 2
  const mapa = L.map("mapa").setView([0, 0], 2);

  // Dodajemo tamni stil pločica (tiles) na mapu
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 10,
    minZoom: 1,
  }).addTo(mapa);

  // Kreiramo marker (ikonicu svemirske stanice) i stavljamo ga na mapu
  const marker = L.marker([0, 0], {
    icon: L.divIcon({
      className: "iss-icon",
      html: "🛰️",
      iconSize: [42, 42],
      iconAnchor: [16, 16],
    }),
  }).addTo(mapa);

  // Kreiramo prazan sloj za trag koji ISS ostavlja iza sebe
  const trail = L.layerGroup().addTo(mapa);

  // Lista točaka za crtanje traga (max 100 točaka)
  const points = [];

  // Ova varijabla prati jesmo li prvi put dobili poziciju
  let firstTime = true;


  // --- FUNKCIJA ZA DOHVAĆANJE I PRIKAZ PODATAKA ---

  async function updateISS() {

    // Pitamo naš Flask server za trenutnu poziciju ISS-a
    const response = await fetch("/iss");
    const data = await response.json();

    // Izvlačimo vrijednosti iz odgovora servera
    const lat   = data.lat;
    const lon   = data.lon;
    const alt   = data.alt;
    const speed = data.speed;

    // Upisujemo vrijednosti u HTML elemente na stranici
    document.getElementById("lat").textContent = lat;
    document.getElementById("lon").textContent = lon;
    document.getElementById("alt").textContent = alt;
    document.getElementById("brz").textContent = speed.toLocaleString();

    // Micemo CSS klasu "loading" sa svih elemenata koji je imaju
    // (ona prikazuje "--" dok se podaci još učitavaju)
    const loadingElements = document.querySelectorAll(".loading");
    for (let i = 0; i < loadingElements.length; i++) {
      loadingElements[i].classList.remove("loading");
    }

    // Pomičemo marker na novu poziciju ISS-a
    marker.setLatLng([lat, lon]);

    // Dodajemo novu točku u listu za trag
    points.push([lat, lon]);

    // Ako imamo više od 100 točaka, brišemo najstariju
    if (points.length > 100) {
      points.shift();
    }

    // Brišemo stari trag i crtamo novi sa svim točkama
    trail.clearLayers();
    if (points.length > 1) {
      L.polyline(points, {
        color: "#4fc3f7",
        weight: 2,
        opacity: 0.6,
        dashArray: "5,5",
      }).addTo(trail);
    }

    // Ako je ovo prvi put, fokusiramo mapu na poziciju ISS-a
    if (firstTime) {
      mapa.setView([lat, lon], 4);
      firstTime = false;
    }
  }


  // --- POKRETANJE ---

  // Odmah pozivamo funkciju jednom pri učitavanju stranice
  updateISS();

  // I onda je pozivamo svake 5 sekundi (5000 milisekundi)
  setInterval(updateISS, 1000);

});
