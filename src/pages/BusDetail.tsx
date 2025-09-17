import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function BusDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const bus = location.state;

  useEffect(() => {
    if (!bus) return;

    const map = L.map("map").setView([bus.lat, bus.lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([bus.lat, bus.lng]).addTo(map).bindPopup(bus.name).openPopup();

    // Simulate movement every 5 seconds
    const interval = setInterval(() => {
      bus.lat += (Math.random() - 0.5) * 0.001;
      bus.lng += (Math.random() - 0.5) * 0.001;
      marker.setLatLng([bus.lat, bus.lng]);
      map.setView([bus.lat, bus.lng]);
    }, 5000);

    return () => clearInterval(interval);
  }, [bus]);

  if (!bus) return <p className="text-center mt-10">No bus data found.</p>;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <button className="text-blue-500 mb-2" onClick={() => navigate(-1)}>← Back</button>
      <div id="map" className="w-full h-64 rounded-xl shadow"></div>

      <div className="bg-white rounded-xl shadow p-4 text-center">
        <h1 className="text-xl font-bold mb-2">{bus.name}</h1>
        <p>Next Stop: {bus.stop}</p>
        <p>ETA: {bus.eta}</p>
        <p>Empty Seats: {bus.seats}</p>
      </div>
    </div>
  );
}
