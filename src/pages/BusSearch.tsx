import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

// Example mock bus data for use in your app
export const mockBuses = [
  {
    id: 1,
    name: "Route 45A - City Center",
    eta: "5 min",
    seats: 7,
    stop: "Punjagutta",
    lat: 17.4239,
    lng: 78.4521,
    routeNumber: "45A"
  },
  {
    id: 2,
    name: "Route 23B - Airport",
    eta: "12 min",
    seats: 3,
    stop: "Begumpet",
    lat: 17.4486,
    lng: 78.4712,
    routeNumber: "23B"
  },
  {
    id: 3,
    name: "Route 10H - Secunderabad",
    eta: "8 min",
    seats: 10,
    stop: "Secunderabad",
    lat: 17.4399,
    lng: 78.4983,
    routeNumber: "10H"
  },
  {
    id: 4,
    name: "Route 49M - Mehdipatnam",
    eta: "15 min",
    seats: 5,
    stop: "Mehdipatnam",
    lat: 17.3955,
    lng: 78.4346,
    routeNumber: "49M"
  },
  {
    id: 5,
    name: "Route 8C - Koti",
    eta: "6 min",
    seats: 12,
    stop: "Koti",
    lat: 17.3850,
    lng: 78.4867,
    routeNumber: "8C"
  },
  {
    id: 6,
    name: "Route 218D - LB Nagar",
    eta: "20 min",
    seats: 2,
    stop: "LB Nagar",
    lat: 17.3536,
    lng: 78.5286,
    routeNumber: "218D"
  }
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
