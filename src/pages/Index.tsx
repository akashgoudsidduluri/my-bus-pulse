import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Languages } from "@/components/sections/Languages";
import { Benefits } from "@/components/sections/Benefits";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Languages />
      <Benefits />
      <Footer />
    </div>
  );
};

export default Index;
