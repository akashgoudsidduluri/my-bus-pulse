import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockBuses } from './BusSearch';

const BusDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock bus data - in real app, fetch based on ID
  const busData = {
    id: id,
    name: 'Express City Bus',
    route: 'City Center → Airport',
    departure: '09:30 AM',
    arrival: '11:15 AM',
    duration: '1h 45m',
    price: '₹150',
    seats: 32,
    rating: 4.5,
    amenities: ['WiFi', 'AC', 'Charging Port', 'Reclining Seats']
  };

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
                    onClick={() => {
                      navigate(`/bus/${bus.id}`);
                      window.location.reload();
                    }}
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