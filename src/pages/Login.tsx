import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signup({
          email,
          password,
          firstName,
          lastName
        });

        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created Successfully",
            description: "Please check your email to verify your account."
          });
          navigate('/');
        }
      } else {
        const { error } = await login(email, password);

        if (error) {
          toast({
            title: "Login Failed",
            description: error,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome Back!",
            description: "You have successfully logged in."
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="bg-gradient-card rounded-3xl p-8 shadow-navbus-large max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {isSignUp ? "Join" : "Login to"} <span className="text-navbus-blue">navbus</span>
              </h1>
              <p className="text-muted-foreground">
                {isSignUp ? "Create your account to get started." : "Welcome back! Please sign in to continue."}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <Input 
                      id="firstName"
                      type="text" 
                      placeholder="Enter your first name" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="transition-navbus focus:shadow-navbus-soft"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Input 
                      id="lastName"
                      type="text" 
                      placeholder="Enter your last name" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="transition-navbus focus:shadow-navbus-soft"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="transition-navbus focus:shadow-navbus-soft"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="transition-navbus focus:shadow-navbus-soft"
                />
              </div>
              
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : (isSignUp ? "Sign Up" : "Login")}
              </Button>
            </form>
            
            <div className="text-center mt-6 space-x-4">
              {!isSignUp && (
                <Link 
                  to="#" 
                  className="text-navbus-blue hover:underline text-sm transition-navbus"
                >
                  Forgot Password?
                </Link>
              )}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-navbus-blue hover:underline text-sm transition-navbus"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;