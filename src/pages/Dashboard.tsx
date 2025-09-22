import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-navbus-blue/10 rounded-full mb-6">
                <User className="w-10 h-10 text-navbus-blue" />
              </div>
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
            </div>

            {/* User Info Card */}
            <Card className="mb-8 bg-gradient-card border-navbus-blue/20">
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

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-navbus-blue/20 hover:shadow-navbus-soft transition-all duration-300">
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

              <Card className="bg-gradient-card border-navbus-blue/20 hover:shadow-navbus-soft transition-all duration-300">
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
            </div>

            {/* Recent Activity */}
            <Card className="mt-8 bg-gradient-card border-navbus-blue/20">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;