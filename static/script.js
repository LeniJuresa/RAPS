document.addEventListener("DOMContentLoaded", function () {

  const mapa = L.map("mapa").setView([0, 0], 2);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 10,
    minZoom: 1,
  }).addTo(mapa);

  const marker = L.marker([0, 0], {
    icon: L.divIcon({
      className: "iss-icon",
      html: "🛰️",
      iconSize: [42, 42],
      iconAnchor: [16, 16],
    }),
  }).addTo(mapa);


  const points = [];

  const polyline = L.polyline([], {
    color: "#4fc3f7",
    weight: 2,
    opacity: 0.6,
    dashArray: "5,5",
  }).addTo(mapa);


  let firstTime = true;
  async function updateISS() {
    const response = await fetch("/iss");
    const data = await response.json();
    const lat   = data.lat;
    const lon   = data.lon;
    const alt   = data.alt;
    const speed = data.speed;
 
    document.getElementById("lat").textContent = lat;
    document.getElementById("lon").textContent = lon;
    document.getElementById("alt").textContent = alt;
    document.getElementById("brz").textContent = speed.toLocaleString();

    const loadingElements = document.querySelectorAll(".loading");
    for (let i = 0; i < loadingElements.length; i++) {
      loadingElements[i].classList.remove("loading");
    }

    marker.setLatLng([lat, lon]);

    points.push([lat, lon]);

    if (points.length > 100) {
      points.shift();
    }
    polyline.setLatLngs(points);


    if (firstTime) {
      mapa.setView([lat, lon], 4);
      firstTime = false;
    }
  }


  updateISS();
  setInterval(updateISS, 1000);

});
