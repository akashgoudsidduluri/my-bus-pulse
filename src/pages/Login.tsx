import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="bg-gradient-card rounded-3xl p-8 shadow-safari-large max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Login to <span className="text-safari-blue">Safari</span>
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Please sign in to continue.
              </p>
            </div>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username or Email
                </label>
                <Input 
                  id="username"
                  type="text" 
                  placeholder="Enter your username or email" 
                  required 
                  className="transition-safari focus:shadow-safari-soft"
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
                  required 
                  className="transition-safari focus:shadow-safari-soft"
                />
              </div>
              
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
              >
                Login
              </Button>
            </form>
            
            <div className="text-center mt-6 space-x-4">
              <Link 
                to="#" 
                className="text-safari-blue hover:underline text-sm transition-safari"
              >
                Forgot Password?
              </Link>
              <Link 
                to="#" 
                className="text-safari-blue hover:underline text-sm transition-safari"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}