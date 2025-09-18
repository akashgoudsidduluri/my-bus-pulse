import React, { useState } from 'react';
import { MapPin, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function RouteSearch() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    if (origin && destination) {
      navigate(`/buses?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-background/95 backdrop-blur-sm border-2 shadow-navbus-medium">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter pickup location"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="hidden md:flex items-center justify-center pb-2">
              <ArrowRight className="h-5 w-5 text-navbus-blue" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full"
            variant="navbus"
            size="lg"
            disabled={!origin || !destination}
          >
            <Search className="h-4 w-4 mr-2" />
            Search Buses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}