import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="text-NavBus-blue">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions or need support? Reach out to us!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-card rounded-2xl p-6 shadow-NavBus-soft">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-primary rounded-lg p-3">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-muted-foreground">Get help via email</p>
                  </div>
                </div>
                <a 
                  href="mailto:support@NavBus.com" 
                  className="text-NavBus-blue hover:underline text-lg"
                >
                  support@NavBus.com
                </a>
              </div>

              <div className="bg-gradient-card rounded-2xl p-6 shadow-NavBus-soft">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-secondary rounded-lg p-3">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-muted-foreground">Call us directly</p>
                  </div>
                </div>
                <a 
                  href="tel:+91-1800-NavBus" 
                  className="text-NavBus-blue hover:underline text-lg"
                >
                  1800-NavBus
                </a>
              </div>

              <div className="bg-gradient-card rounded-2xl p-6 shadow-NavBus-soft">
                <div className="flex items-center gap-4">
                  <div className="bg-NavBus-green rounded-lg p-3">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">24/7 Support</h3>
                    <p className="text-muted-foreground">We're always here to help</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card rounded-3xl p-8 shadow-NavBus-large">
              <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input 
                    id="name"
                    type="text" 
                    placeholder="Enter your name" 
                    required 
                    className="transition-NavBus focus:shadow-NavBus-soft"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Your Email
                  </label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    className="transition-NavBus focus:shadow-NavBus-soft"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Tell us how we can help you..." 
                    required 
                    rows={6}
                    className="transition-NavBus focus:shadow-NavBus-soft"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}