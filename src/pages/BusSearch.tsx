import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const mockBuses = [
  { id: 1, name: "Route 45A - City Center", eta: "5 min", seats: 7, stop: "Punjagutta", lat: 17.4239, lng: 78.4521 },
  { id: 2, name: "Route 23B - Airport", eta: "12 min", seats: 3, stop: "Begumpet", lat: 17.4486, lng: 78.4712 }
];

export default function BusSearch() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Search for Buses</h1>

      <div className="space-y-4">
        {mockBuses.map((bus) => (
          <Card
            key={bus.id}
            className="cursor-pointer hover:bg-gray-50 transition"
            onClick={() => navigate(`/bus/${bus.id}`, { state: bus })}
          >
            <CardContent className="p-4">
              <h2 className="font-semibold">{bus.name}</h2>
              <p className="text-sm text-gray-600">ETA: {bus.eta} | Empty Seats: {bus.seats}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
