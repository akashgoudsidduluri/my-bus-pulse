import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Features as FeaturesSection } from "@/components/sections/Features";
import { Languages } from "@/components/sections/Languages";

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-16">
        <FeaturesSection />
        <Languages />
      </main>

      <Footer />
    </div>
  );
}