import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Languages } from "@/components/sections/Languages";
import { Benefits } from "@/components/sections/Benefits";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ParallaxContainer } from "@/components/ui/parallax";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground variant="mixed" intensity="medium" color="blue" />
      
      <Header />
      <Hero />
      
      {/* Parallax sections */}
      <ParallaxContainer speed={0.3}>
        <Features />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.5}>
        <Languages />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.2}>
        <Benefits />
      </ParallaxContainer>
      
      <Footer />
    </div>
  );
};

export default Index;
