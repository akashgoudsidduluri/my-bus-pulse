import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BusStop {
  name: string;
  lat: number;
  lng: number;
  eta: string;
  seatsLeft: number;
}

interface GoogleMapProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  busStops: BusStop[];
  onSeatUpdate: (seats: number) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  startLat,
  startLng,
  endLat,
  endLng,
  busStops,
  onSeatUpdate
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [busMarker, setBusMarker] = useState<google.maps.Marker | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const initializeMap = async (key: string) => {
    if (!mapRef.current || !key) return;

    try {
      const loader = new Loader({
        apiKey: key,
        version: 'weekly',
        libraries: ['geometry']
      });

      await loader.load();

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: startLat, lng: startLng },
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });

      setMap(mapInstance);

      // Add start marker
      new google.maps.Marker({
        position: { lat: startLat, lng: startLng },
        map: mapInstance,
        title: 'Start Location',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      // Add end marker
      new google.maps.Marker({
        position: { lat: endLat, lng: endLng },
        map: mapInstance,
        title: 'Destination',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      // Add bus stops
      busStops.forEach((stop, index) => {
        new google.maps.Marker({
          position: { lat: stop.lat, lng: stop.lng },
          map: mapInstance,
          title: stop.name,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="6" width="18" height="15" rx="2"/>
                <path d="M8 21v-5"/>
                <path d="M16 21v-5"/>
                <path d="M8 10h8"/>
                <path d="M8 14h8"/>
                <path d="M3 6V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(25, 25)
          }
        });
      });

      // Create bus marker
      const bus = new google.maps.Marker({
        position: { lat: startLat, lng: startLng },
        map: mapInstance,
        title: 'Bus Location',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="orange" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6h8V6"/>
              <path d="M4 6h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"/>
              <circle cx="7" cy="17" r="1"/>
              <circle cx="17" cy="17" r="1"/>
              <path d="M5 11h14"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      setBusMarker(bus);
      setIsMapLoaded(true);

      // Draw route path
      const routePath = new google.maps.Polyline({
        path: [
          { lat: startLat, lng: startLng },
          ...busStops.map(stop => ({ lat: stop.lat, lng: stop.lng })),
          { lat: endLat, lng: endLng }
        ],
        geodesic: true,
        strokeColor: '#4285F4',
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });

      routePath.setMap(mapInstance);

    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  };

  const animateBus = () => {
    if (!busMarker || !map || isAnimating || currentStopIndex >= busStops.length) return;

    setIsAnimating(true);
    const currentStop = busStops[currentStopIndex];
    
    // Animate to next stop
    const startPos = busMarker.getPosition();
    const endPos = new google.maps.LatLng(currentStop.lat, currentStop.lng);
    
    let step = 0;
    const numSteps = 100;
    const stepLat = (endPos.lat() - startPos!.lat()) / numSteps;
    const stepLng = (endPos.lng() - startPos!.lng()) / numSteps;

    const timer = setInterval(() => {
      step++;
      const newLat = startPos!.lat() + (stepLat * step);
      const newLng = startPos!.lng() + (stepLng * step);
      
      busMarker.setPosition(new google.maps.LatLng(newLat, newLng));

      if (step >= numSteps) {
        clearInterval(timer);
        setIsAnimating(false);
        
        // Update seats when reaching stop
        onSeatUpdate(currentStop.seatsLeft);
        setCurrentStopIndex(prev => prev + 1);
      }
    }, 50);
  };

  const resetAnimation = () => {
    if (busMarker) {
      busMarker.setPosition({ lat: startLat, lng: startLng });
      setCurrentStopIndex(0);
      setIsAnimating(false);
      onSeatUpdate(busStops[0]?.seatsLeft || 5);
    }
  };

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Maps Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please enter your Google Maps API key to view the live bus tracking map.
            Get your API key from the Google Cloud Console.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter Google Maps API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={() => initializeMap(apiKey)}>
              Load Map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          onClick={animateBus} 
          disabled={isAnimating || currentStopIndex >= busStops.length}
        >
          {isAnimating ? 'Moving...' : 'Move to Next Stop'}
        </Button>
        <Button onClick={resetAnimation} variant="outline">
          Reset Route
        </Button>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border"
        style={{ minHeight: '400px' }}
      />
      {isMapLoaded && (
        <div className="text-sm text-muted-foreground">
          Current Stop: {currentStopIndex < busStops.length ? busStops[currentStopIndex].name : 'Destination Reached'}
        </div>
      )}
    </div>
  );
};

export default GoogleMap;