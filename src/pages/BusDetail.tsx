import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, Star, Bus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockBuses } from './BusSearch';
import GoogleMap from '@/components/ui/google-map';

const BusDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBusStops, setShowBusStops] = useState(false);
  const [currentSeats, setCurrentSeats] = useState(0);

  // Find bus data based on ID
  const selectedBus = mockBuses.find(bus => bus.id.toString() === id);
  
  // Mock bus stops data
  const busStops = [
    { name: 'Central Station', lat: 17.4326, lng: 78.4071, eta: '2 min', seatsLeft: 8 },
    { name: 'Tech City', lat: 17.4504, lng: 78.3808, eta: '8 min', seatsLeft: 5 },
    { name: 'Mall Junction', lat: 17.4278, lng: 78.4094, eta: '15 min', seatsLeft: 3 },
    { name: 'University Gate', lat: 17.4183, lng: 78.4265, eta: '22 min', seatsLeft: 7 },
    { name: 'Business District', lat: 17.4065, lng: 78.4404, eta: '28 min', seatsLeft: 2 }
  ];
  
  // Mock detailed bus data - in real app, fetch based on ID
  const busData = selectedBus ? {
    id: selectedBus.id,
    name: selectedBus.name,
    route: `${selectedBus.stop} → Destination`,
    departure: '09:30 AM',
    arrival: '11:15 AM',
    duration: '1h 45m',
    price: '₹150',
    seats: currentSeats || selectedBus.seats,
    rating: 4.5,
    amenities: ['WiFi', 'AC', 'Charging Port', 'Reclining Seats'],
    startLat: selectedBus.lat,
    startLng: selectedBus.lng,
    endLat: 17.4065,
    endLng: 78.4404
  } : null;

  if (!busData) {
    return <div>Bus not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* Bus List Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Buses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {mockBuses.map((bus) => (
                  <Card
                    key={bus.id}
                    className={`cursor-pointer transition-colors ${
                      bus.id.toString() === id 
                        ? 'border-primary bg-primary/10' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => navigate(`/bus/${bus.id}`)}
                  >
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm">{bus.name}</h3>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>ETA: {bus.eta}</span>
                        <span>{bus.seats} seats</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Bus Detail */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {busData.name}
                </CardTitle>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {busData.route}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Departure: {busData.departure}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Arrival: {busData.arrival}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-medium">{busData.seats} seats available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">{busData.rating}/5 rating</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-primary">
                      {busData.price}
                    </div>
                    <div className="text-muted-foreground">
                      Duration: {busData.duration}
                    </div>
                    <Button size="lg" className="w-full">
                      Book Now
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowBusStops(!showBusStops)}
                    >
                      <Bus className="h-4 w-4 mr-2" />
                      Bus Stops
                    </Button>
                  </div>
                  
                  {showBusStops && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Bus Route Stops</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {busStops.map((stop, index) => (
                            <div 
                              key={index}
                              className="flex justify-between items-center p-3 border rounded-lg"
                            >
                              <div>
                                <h4 className="font-medium">{stop.name}</h4>
                                <p className="text-sm text-muted-foreground">ETA: {stop.eta}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{stop.seatsLeft} seats</p>
                                <p className="text-xs text-muted-foreground">available</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {busData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Live Bus Tracking</h3>
                  <GoogleMap
                    startLat={busData.startLat}
                    startLng={busData.startLng}
                    endLat={busData.endLat}
                    endLng={busData.endLng}
                    busStops={busStops}
                    onSeatUpdate={setCurrentSeats}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BusDetail;