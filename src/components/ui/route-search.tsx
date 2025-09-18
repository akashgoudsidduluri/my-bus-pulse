import React, { useState } from 'react';
import { MapPin, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function RouteSearch() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleSearch = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (origin && destination) {
      navigate(`/buses?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`);
    }
  };

  const handleInputFocus = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
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
                    onFocus={handleInputFocus}
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
                    onFocus={handleInputFocus}
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

      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Please sign in to search for bus routes and access NavBus features.
            </p>
            <div className="flex space-x-3">
              <Button onClick={handleLoginRedirect} className="flex-1">
                Sign In / Sign Up
              </Button>
              <Button 
                onClick={() => setShowLoginPrompt(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}