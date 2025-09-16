import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight } from "lucide-react";
import heroImage from "@/assets/safari-hero-image.jpg";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Your{" "}
                <span className="text-safari-blue">
                  Smart Travel
                </span>{" "}
                Companion
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Safari revolutionizes public transport with real-time tracking, crowd estimation, 
                and multilingual support. Travel smarter, not harder.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild variant="hero" size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                <Link to="/login">
                  <Rocket className="mr-2 h-4 h-5 w-4 sm:w-5" />
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                <Link to="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 scale-105"></div>
              <div className="relative bg-gradient-card rounded-3xl p-4 sm:p-6 lg:p-8 shadow-safari-large">
                <img 
                  src={heroImage} 
                  alt="Safari app interface showing real-time bus tracking" 
                  className="w-full h-auto rounded-2xl shadow-safari-medium"
                />
                
                {/* App mockup overlay */}
                <div className="absolute top-6 sm:top-8 lg:top-12 left-6 sm:left-8 lg:left-12 right-6 sm:right-8 lg:right-12 bg-background/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-safari-soft">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="font-semibold text-safari-blue text-sm sm:text-base">Safari</h3>
                    <span className="text-xl sm:text-2xl">🌐</span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="bg-gradient-card rounded-lg p-2 sm:p-3 border-l-4 border-safari-green">
                      <div className="font-medium text-xs sm:text-sm">Route 45A - City Center</div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>🚌 Arriving in 5 min</span>
                        <span className="text-safari-green">👥 Moderate</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-card rounded-lg p-2 sm:p-3 border-l-4 border-safari-blue">
                      <div className="font-medium text-xs sm:text-sm">Route 23B - Airport</div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>🚌 Arriving in 12 min</span>
                        <span className="text-safari-green">👥 Light</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}