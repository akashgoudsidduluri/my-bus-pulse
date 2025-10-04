import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, ArrowRight, MapPin, Clock } from "lucide-react";
import { RouteSearch } from "@/components/ui/route-search";
import { useAuth } from "@/contexts/AuthContext";

const mockBuses = [
  { id: 1, name: "Route 45A - City Center", eta: "5 min", seats: 7, stop: "Punjagutta", lat: 17.4239, lng: 78.4521 },
  { id: 2, name: "Route 23B - Airport", eta: "12 min", seats: 3, stop: "Begumpet", lat: 17.4486, lng: 78.4712 }
];

export function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="min-h-screen flex items-center pt-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              {isAuthenticated ? (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                    Welcome back{user?.profile?.first_name ? `, ${user.profile.first_name}` : ''}!
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    Ready to plan your next journey? Find real-time bus information and track your routes.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                    Your{" "}
                    <span className="text-navbus-blue">
                      Smart Travel
                    </span>{" "}
                    Companion
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    NavBus revolutionizes public transport with real-time tracking, crowd estimation, 
                    and multilingual support. Travel smarter, not harder.
                  </p>
                </>
              )}
            </div>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild variant="hero" size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  <Link to="/buses">
                    <MapPin className="mr-2 h-4 h-5 w-4 sm:w-5" />
                    Find Buses
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  <Link to="/profile">
                    <Clock className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                    My Profile
                  </Link>
                </Button>
              </div>
            ) : null}
            
            {/* Route Search - always visible */}
            <div className="mt-8">
              <RouteSearch />
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 scale-105"></div>
              <div className="relative bg-background/95 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 shadow-navbus-large border border-border">
                 <div className="flex items-center justify-between mb-4 sm:mb-6">
                   <h3 className="font-semibold text-navbus-blue text-lg sm:text-xl">NavBus</h3>
                  <span className="text-2xl sm:text-3xl">🌐</span>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {mockBuses.map((bus) => (
                    <Card
                      key={bus.id}
                      className="cursor-pointer hover:bg-muted/50 transition-all duration-300 border-l-4 border-l-navbus-blue"
                      onClick={() => navigate(`/bus/${bus.id}`, { state: bus })}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="font-medium text-sm sm:text-base mb-2">{bus.name}</div>
                        <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            🚌 Arriving in {bus.eta}
                          </span>
                          <span className="flex items-center gap-1 text-navbus-green">
                            👥 {bus.seats < 5 ? 'Light' : 'Moderate'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <Button 
                    onClick={() => navigate('/buses')}
                    variant="outline" 
                    className="w-full text-sm sm:text-base"
                  >
                    View All Buses
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}