import React, { useState } from 'react';
import { MapPin, ArrowRight, Search, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResult {
  id: number;
  route: string;
  from: string;
  to: string;
  eta: string;
  crowd: 'Light' | 'Moderate' | 'Heavy';
}

const mockResults: SearchResult[] = [
  { id: 1, route: '45A', from: 'City Center', to: 'Airport', eta: '5 min', crowd: 'Moderate' },
  { id: 2, route: '23B', from: 'Downtown', to: 'University', eta: '12 min', crowd: 'Light' },
  { id: 3, route: '10H', from: 'Secunderabad', to: 'Mehdipatnam', eta: '8 min', crowd: 'Heavy' },
  { id: 4, route: '49M', from: 'Punjagutta', to: 'LB Nagar', eta: '15 min', crowd: 'Moderate' },
];

export function RouteSearch() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (origin && destination) {
      setIsSearching(true);
      setHasSearched(true);
      setSearchResults([]);
      
      // Simulate search delay
      setTimeout(() => {
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 1200);
    }
  };

  const getCrowdColor = (crowd: string) => {
    switch (crowd) {
      case 'Light': return 'text-green-600 dark:text-green-400';
      case 'Moderate': return 'text-yellow-600 dark:text-yellow-400';
      case 'Heavy': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="bg-background/95 backdrop-blur-sm border-2 shadow-navbus-medium">
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
              disabled={!origin || !destination || isSearching}
            >
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search Buses'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {isSearching ? 'Searching...' : `Found ${searchResults.length} buses`}
          </h3>
          
          {isSearching ? (
            // Loading skeletons
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-2">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-2/3" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Actual results
            <div className="space-y-3">
              {searchResults.map((result) => (
                <Card 
                  key={result.id} 
                  className="border-2 hover:shadow-navbus-medium transition-shadow cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-lg">
                          Route {result.route} – {result.from} → {result.to}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-navbus-blue" />
                            <span className="text-muted-foreground">Arriving in</span>
                            <span className="font-medium">{result.eta}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-navbus-blue" />
                            <span className="text-muted-foreground">Crowd:</span>
                            <span className={`font-medium ${getCrowdColor(result.crowd)}`}>
                              {result.crowd}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}