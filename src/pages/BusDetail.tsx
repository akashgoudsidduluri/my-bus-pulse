import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import busIcon from "@/assets/bus-icon.svg";

export default function BusDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const bus = location.state;

  useEffect(() => {
    if (!bus) return;

    // Create custom bus icon
    const customBusIcon = L.icon({
      iconUrl: busIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    const map = L.map("map").setView([bus.lat, bus.lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([bus.lat, bus.lng], { icon: customBusIcon }).addTo(map).bindPopup(bus.name).openPopup();

    // Simulate movement every 5 seconds
    const interval = setInterval(() => {
      bus.lat += (Math.random() - 0.5) * 0.001;
      bus.lng += (Math.random() - 0.5) * 0.001;
      marker.setLatLng([bus.lat, bus.lng]);
      map.setView([bus.lat, bus.lng]);
    }, 5000);

    return () => clearInterval(interval);
  }, [bus]);

  if (!bus) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-center mt-10">No bus data found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-2 text-navbus-blue hover:text-navbus-blue/80"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div id="map" className="w-full h-64 rounded-xl shadow-navbus-medium"></div>

      <div className="bg-background border border-border rounded-xl shadow-navbus-soft p-4 text-center">
        <h1 className="text-xl font-bold mb-2 text-navbus-blue">{bus.name}</h1>
        <p className="text-muted-foreground">Next Stop: <span className="font-medium text-foreground">{bus.stop}</span></p>
        <p className="text-muted-foreground">ETA: <span className="font-medium text-foreground">{bus.eta}</span></p>
        <p className="text-muted-foreground">Empty Seats: <span className="font-medium text-navbus-green">{bus.seats}</span></p>
      </div>
    </div>
  );
}
