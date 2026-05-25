document.addEventListener("DOMContentLoaded", () => {
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

  const trail = L.layerGroup().addTo(mapa);
  let points = [],
    first = true;

  async function update() {
    try {
      const { lat, lon, alt, speed } = await fetch("/iss").then((r) =>
        r.json(),
      );

      document.getElementById("lat").textContent = lat;
      document.getElementById("lon").textContent = lon;
      document.getElementById("alt").textContent = alt;
      document.getElementById("brz").textContent = speed.toLocaleString();
      document
        .querySelectorAll(".loading")
        .forEach((el) => el.classList.remove("loading"));

      marker.setLatLng([lat, lon]);

      points.push([lat, lon]);
      if (points.length > 100) points.shift();

      trail.clearLayers();
      if (points.length > 1) {
        L.polyline(points, {
          color: "#4fc3f7",
          weight: 2,
          opacity: 0.6,
          dashArray: "5,5",
        }).addTo(trail);
      }

      if (first) {
        mapa.setView([lat, lon], 4);
        first = false;
      }
    } catch (err) {
      console.error("Greška pri dohvaćanju ISS podataka:", err);
    }
  }

  update();
  setInterval(update, 5000);
})();
