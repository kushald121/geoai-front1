
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const HighlightZone = ({ lat, lng, zoneName }) => {
  const map = useMap();

  useEffect(() => {
    if (!lat || !lng) return;

    const highlight = L.circleMarker([lat, lng], {
      radius: 10,
      color: "#00ff00",
      fillColor: "#00ff00",
      fillOpacity: 0.6,
    })
      .addTo(map)
      .bindPopup(`✅ AI chose: ${zoneName}`)
      .openPopup();

    map.setView([lat, lng], 13);

    return () => map.removeLayer(highlight);
  }, [lat, lng, zoneName, map]);

  return null;
};

const GeoMap = ({ highlightCoords, geoData }) => {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer center={[28.75, 77.2]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {geoData && (
          <GeoJSON
            data={geoData}
            onEachFeature={(feature, layer) => {
              const props = feature.properties;
              layer.bindPopup(
                `<b>${props.name}</b><br>Flood Risk: ${props.flood_risk}<br>Population: ${props.population}`
              );
            }}
          />
        )}

        {highlightCoords && (
          <HighlightZone lat={highlightCoords.lat} lng={highlightCoords.lng} zoneName={highlightCoords.zoneName} />
        )}
      </MapContainer>
    </div>
  );
};

export default GeoMap;
