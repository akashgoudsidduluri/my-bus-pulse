import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ParallaxElement } from "@/components/ui/parallax";
import { FloatingElement, GlowEffect } from "@/components/ui/floating-effects";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Phone, MapPin, Bus } from "lucide-react";

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      {/* Animated Background */}
      <AnimatedBackground variant="geometric" intensity="low" color="cyan" />
      
      <Header />
      
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <ParallaxElement speed={0.2}>
              <div className="text-center mb-12">
                <FloatingElement delay={0} duration={10} amplitude={20}>
                  <GlowEffect color="rgba(6, 182, 212, 0.6)" intensity="high">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-navbus-blue/10 rounded-full mb-6">
                      <User className="w-10 h-10 text-navbus-blue" />
                    </div>
                  </GlowEffect>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Welcome to Your <span className="text-navbus-blue">Dashboard</span>
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    Your personal NavBus control center
                  </p>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    size="lg"
                    className="inline-flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </FloatingElement>
              </div>
            </ParallaxElement>

            {/* User Info Card */}
            <ParallaxElement speed={0.4}>
              <FloatingElement delay={1} duration={8} amplitude={12}>
                <Card className="mb-8 bg-gradient-card border-navbus-blue/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-navbus-blue">
                      <Phone className="w-5 h-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>
                      Your authenticated session details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Phone Number:</span>
                        <span className="font-medium">{user?.phone || 'Not available'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">User ID:</span>
                        <span className="font-mono text-sm">{user?.id?.slice(0, 8)}...</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Last Sign In:</span>
                        <span className="font-medium">
                          {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FloatingElement>
            </ParallaxElement>

            {/* Quick Actions */}
            <ParallaxElement speed={0.6}>
              <div className="grid md:grid-cols-2 gap-6">
                <FloatingElement delay={2} duration={12} amplitude={8}>
                  <Card className="bg-gradient-card border-navbus-blue/20 hover:shadow-navbus-soft transition-all duration-300 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-navbus-blue">
                        <Bus className="w-5 h-5" />
                        Find Buses
                      </CardTitle>
                      <CardDescription>
                        Search for real-time bus information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="hero" 
                        size="lg" 
                        className="w-full"
                        onClick={() => navigate('/buses')}
                      >
                        Search Buses
                      </Button>
                    </CardContent>
                  </Card>
                </FloatingElement>

                <FloatingElement delay={2.5} duration={14} amplitude={10}>
                  <Card className="bg-gradient-card border-navbus-blue/20 hover:shadow-navbus-soft transition-all duration-300 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-navbus-blue">
                        <MapPin className="w-5 h-5" />
                        Route Planning
                      </CardTitle>
                      <CardDescription>
                        Plan your journey with live updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full"
                        onClick={() => navigate('/')}
                      >
                        Plan Route
                      </Button>
                    </CardContent>
                  </Card>
                </FloatingElement>
              </div>
            </ParallaxElement>

            {/* Recent Activity */}
            <ParallaxElement speed={0.8}>
              <FloatingElement delay={3} duration={16} amplitude={6}>
                <Card className="mt-8 bg-gradient-card border-navbus-blue/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-navbus-blue">Recent Activity</CardTitle>
                    <CardDescription>
                      Your recent NavBus usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Bus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity yet.</p>
                      <p className="text-sm">Start using NavBus to see your activity here!</p>
                    </div>
                  </CardContent>
                </Card>
              </FloatingElement>
            </ParallaxElement>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;