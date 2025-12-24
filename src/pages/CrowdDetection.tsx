import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CrowdDetector } from "@/components/crowd-detection/CrowdDetector";
import { Users } from "lucide-react";

export default function CrowdDetection() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-navbus-blue/10 rounded-full mb-4">
              <Users className="w-8 h-8 text-navbus-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Crowd <span className="text-navbus-blue">Detection</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of any bus or bus stop and our AI will instantly analyze 
              the crowd level to help you plan your journey better.
            </p>
          </div>

          <CrowdDetector />
        </div>
      </main>

      <Footer />
    </div>
  );
}