import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusTracking } from '@/hooks/useBusTracking';
import { getSimulator } from '@/services/busSimulator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Activity, Clock, Navigation } from 'lucide-react';

export default function LiveTracking() {
  const { buses, isLoading, error } = useBusTracking();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [simulatorRunning, setSimulatorRunning] = useState(false);

  const handleStartSimulator = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start the simulator",
        variant: "destructive"
      });
      return;
    }

    const simulator = getSimulator();
    await simulator.start();
    setSimulatorRunning(true);
    
    toast({
      title: "Simulator Started",
      description: "Bus positions are now being updated every 5 seconds"
    });
  };

  const handleStopSimulator = () => {
    const simulator = getSimulator();
    simulator.stop();
    setSimulatorRunning(false);
    
    toast({
      title: "Simulator Stopped",
      description: "Position updates have been paused"
    });
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[hsl(var(--gov-navy))] mb-4">
              Live Bus Tracking
            </h1>
            <p className="text-[hsl(var(--gov-gray))]">
              Real-time positions of all active buses in the fleet
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Simulator Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={handleStartSimulator}
                  disabled={simulatorRunning || !isAuthenticated}
                  className="bg-[hsl(var(--gov-navy))] hover:bg-[hsl(var(--gov-navy-dark))]"
                >
                  Start Simulator
                </Button>
                <Button
                  onClick={handleStopSimulator}
                  disabled={!simulatorRunning}
                  variant="outline"
                  className="border-[hsl(var(--gov-navy))] text-[hsl(var(--gov-navy))]"
                >
                  Stop Simulator
                </Button>
              </div>
              {!isAuthenticated && (
                <p className="text-sm text-[hsl(var(--gov-gray))] mt-2">
                  Please log in to use the simulator
                </p>
              )}
              {simulatorRunning && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-pulse" />
                  Simulator is running - positions update every 5 seconds
                </p>
              )}
            </CardContent>
          </Card>

          {isLoading && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 animate-spin mx-auto text-[hsl(var(--gov-navy))]" />
              <p className="mt-4 text-[hsl(var(--gov-gray))]">Loading bus positions...</p>
            </div>
          )}

          {error && (
            <Card className="border-red-500">
              <CardContent className="pt-6">
                <p className="text-red-600">Error: {error}</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buses.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="pt-6 text-center">
                    <MapPin className="h-12 w-12 mx-auto text-[hsl(var(--gov-gray))] mb-4" />
                    <p className="text-[hsl(var(--gov-gray))]">
                      No buses currently tracked. Start the simulator to generate data.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                buses.map((bus) => (
                  <Card key={bus.vehicle_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Navigation className="h-5 w-5 text-[hsl(var(--gov-navy))]" />
                        {bus.vehicle_id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-[hsl(var(--gov-gray))]" />
                        <span className="text-[hsl(var(--gov-gray))]">Position:</span>
                        <span className="font-mono">
                          {bus.last_lat?.toFixed(6)}, {bus.last_lon?.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-[hsl(var(--gov-gray))]" />
                        <span className="text-[hsl(var(--gov-gray))]">Last Update:</span>
                        <span>{formatTimestamp(bus.last_update)}</span>
                      </div>
                      {bus.route_id && (
                        <div className="text-sm">
                          <span className="text-[hsl(var(--gov-gray))]">Route:</span>{' '}
                          <span className="font-semibold">{bus.route_id}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
