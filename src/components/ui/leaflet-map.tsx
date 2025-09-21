import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BusStop {
  name: string;
  lat: number;
  lng: number;
  eta: string;
  seatsLeft: number;
}

interface BusMarker {
  id: string;
  lat: number;
  lng: number;
  emoji: string;
}

interface LeafletMapProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  busStops: BusStop[];
  onSeatUpdate: (seats: number) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  startLat,
  startLng,
  endLat,
  endLng,
  busStops,
  onSeatUpdate
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const glowCircleRef = useRef<L.Circle | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Custom bus icon with emoji
  const createBusIcon = () => {
    return L.divIcon({
      html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 24px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          border: 2px solid #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
        ">
          🚌
        </div>
      `,
      className: 'custom-bus-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  // Create glowing circle effect
  const createGlowCircle = (lat: number, lng: number) => {
    return L.circle([lat, lng], {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      radius: 200,
      weight: 2,
      opacity: 0.6,
      className: 'bus-glow-circle'
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [startLat, startLng],
      zoom: 12,
      zoomControl: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add start marker
    const startIcon = L.divIcon({
      html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: #10b981;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        ">
          S
        </div>
      `,
      className: 'start-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    L.marker([startLat, startLng], { icon: startIcon })
      .addTo(map)
      .bindPopup('Start Location');

    // Add end marker
    const endIcon = L.divIcon({
      html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: #ef4444;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        ">
          E
        </div>
      `,
      className: 'end-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    L.marker([endLat, endLng], { icon: endIcon })
      .addTo(map)
      .bindPopup('Destination');

    // Add bus stops
    busStops.forEach((stop, index) => {
      const stopIcon = L.divIcon({
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            background: #8b5cf6;
            border-radius: 50%;
            color: white;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 6px rgba(139, 92, 246, 0.4);
          ">
            ${index + 1}
          </div>
        `,
        className: 'stop-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([stop.lat, stop.lng], { icon: stopIcon })
        .addTo(map)
        .bindPopup(`
          <div>
            <strong>${stop.name}</strong><br>
            ETA: ${stop.eta}<br>
            Seats: ${stop.seatsLeft}
          </div>
        `);
    });

    // Add route polyline
    const routeCoords: [number, number][] = [
      [startLat, startLng],
      ...busStops.map(stop => [stop.lat, stop.lng] as [number, number]),
      [endLat, endLng]
    ];

    L.polyline(routeCoords, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 5'
    }).addTo(map);

    // Create bus marker with glow effect
    const busIcon = createBusIcon();
    const busMarker = L.marker([startLat, startLng], { icon: busIcon }).addTo(map);
    const glowCircle = createGlowCircle(startLat, startLng).addTo(map);

    busMarkerRef.current = busMarker;
    glowCircleRef.current = glowCircle;

    // Set initial seat count
    onSeatUpdate(busStops[0]?.seatsLeft || 5);

    // Cleanup
    return () => {
      map.remove();
    };
  }, [startLat, startLng, endLat, endLng, busStops]);

  const animateBus = () => {
    if (!mapInstanceRef.current || !busMarkerRef.current || !glowCircleRef.current || 
        isAnimating || currentStopIndex >= busStops.length) return;

    setIsAnimating(true);
    const currentStop = busStops[currentStopIndex];
    const startPos = busMarkerRef.current.getLatLng();
    const endPos = L.latLng(currentStop.lat, currentStop.lng);

    let step = 0;
    const numSteps = 60; // Smooth animation steps
    const stepLat = (endPos.lat - startPos.lat) / numSteps;
    const stepLng = (endPos.lng - startPos.lng) / numSteps;

    const animationTimer = setInterval(() => {
      step++;
      const newLat = startPos.lat + (stepLat * step);
      const newLng = startPos.lng + (stepLng * step);
      const newPos = L.latLng(newLat, newLng);

      // Update bus marker and glow circle
      busMarkerRef.current?.setLatLng(newPos);
      glowCircleRef.current?.setLatLng(newPos);

      if (step >= numSteps) {
        clearInterval(animationTimer);
        setIsAnimating(false);
        
        // Update seat count
        onSeatUpdate(currentStop.seatsLeft);
        setCurrentStopIndex(prev => prev + 1);

        // Pan map to follow bus
        mapInstanceRef.current?.panTo(newPos);
      }
    }, 100); // Smooth 100ms intervals
  };

  const resetAnimation = () => {
    if (busMarkerRef.current && glowCircleRef.current) {
      const startPos = L.latLng(startLat, startLng);
      busMarkerRef.current.setLatLng(startPos);
      glowCircleRef.current.setLatLng(startPos);
      setCurrentStopIndex(0);
      setIsAnimating(false);
      onSeatUpdate(busStops[0]?.seatsLeft || 5);
      mapInstanceRef.current?.setView(startPos, 12);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          onClick={animateBus} 
          disabled={isAnimating || currentStopIndex >= busStops.length}
          className="bg-primary hover:bg-primary/90"
        >
          {isAnimating ? 'Moving...' : 'Move to Next Stop'}
        </Button>
        <Button onClick={resetAnimation} variant="outline">
          Reset Route
        </Button>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-border bg-background overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
      <div className="text-sm text-muted-foreground">
        Current Stop: {currentStopIndex < busStops.length ? busStops[currentStopIndex].name : 'Destination Reached'}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-bus-marker {
            animation: pulse-glow 2s infinite;
          }
          
          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
            }
            50% {
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.9);
            }
          }
          
          .bus-glow-circle {
            animation: glow-pulse 3s infinite;
          }
          
          @keyframes glow-pulse {
            0%, 100% {
              opacity: 0.6;
            }
            50% {
              opacity: 0.3;
            }
          }
        `
      }} />
    </div>
  );
};

export default LeafletMap;