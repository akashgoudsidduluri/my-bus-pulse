import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-card rounded-3xl p-8 md:p-12 shadow-navbus-large">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              About <span className="text-navbus-blue">navbus</span>
            </h1>
            
            <div className="space-y-8 text-lg leading-relaxed">
              <p>
                navbus is a next-generation smart mobility and journey management platform designed to 
                revolutionize the way people travel across cities, states, and regions. At its core, 
                navbus is not just an app or a website — it is a comprehensive ecosystem that integrates 
                real-time bus tracking, crowd estimation, multilingual accessibility, offline support, 
                and smart communication tools to make public transport efficient, reliable, and user-friendly.
              </p>

              <div className="bg-gradient-primary/10 rounded-2xl p-6 border-l-4 border-navbus-blue">
                <h2 className="text-2xl font-semibold mb-4 text-navbus-blue">The Problem We Solve</h2>
                <p>
                  Public transport in India, and many other countries, often suffers from issues such as 
                  unpredictable bus timings, overcrowding, lack of real-time updates, poor internet 
                  availability in rural areas, and limited language support. navbus addresses these gaps 
                  and transforms the passenger experience.
                </p>
              </div>

              <div className="bg-gradient-secondary/10 rounded-2xl p-6 border-l-4 border-navbus-green">
                <h2 className="text-2xl font-semibold mb-4 text-navbus-green">Our Mission</h2>
                <p className="text-xl font-medium">
                  To make public transport accessible, efficient, and eco-friendly for everyone.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <div className="bg-gradient-card rounded-2xl p-6 shadow-navbus-soft">
                  <h3 className="text-xl font-semibold mb-3 text-navbus-blue">Our Vision</h3>
                  <p>
                    A world where public transportation is the preferred choice for millions, 
                    powered by technology that makes every journey seamless and sustainable.
                  </p>
                </div>
                
                <div className="bg-gradient-card rounded-2xl p-6 shadow-navbus-soft">
                  <h3 className="text-xl font-semibold mb-3 text-navbus-green">Our Impact</h3>
                  <p>
                    Reducing traffic congestion, lowering carbon emissions, and improving quality 
                    of life for communities across tier-2 and tier-3 cities in India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}