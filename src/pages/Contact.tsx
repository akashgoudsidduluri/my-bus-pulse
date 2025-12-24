import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
});

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = contactSchema.parse(formData);
      
      setIsSubmitting(true);

      // Get current user (if authenticated)
      const { data: { user } } = await supabase.auth.getUser();

      // Submit to database
      const { error } = await supabase
        .from('contact_submissions' as any)
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message
        } as any);

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Submission Failed",
          description: "An error occurred while sending your message. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="text-navbus-blue">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions or need support? Reach out to us!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-card rounded-2xl p-6 shadow-navbus-soft">
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
                  href="mailto:support@navbus.com" 
                  className="text-navbus-blue hover:underline text-lg"
                >
                  support@navbus.com
                </a>
              </div>

              <div className="bg-gradient-card rounded-2xl p-6 shadow-navbus-soft">
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
                  href="tel:+91-1800-navbus" 
                  className="text-navbus-blue hover:underline text-lg"
                >
                  1800-navbus
                </a>
              </div>

              <div className="bg-gradient-card rounded-2xl p-6 shadow-navbus-soft">
                <div className="flex items-center gap-4">
                  <div className="bg-navbus-green rounded-lg p-3">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">24/7 Support</h3>
                    <p className="text-muted-foreground">We're always here to help</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card rounded-3xl p-8 shadow-navbus-large">
              <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input 
                    id="name"
                    type="text" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    className="transition-navbus focus:shadow-navbus-soft"
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
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    className="transition-navbus focus:shadow-navbus-soft"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Tell us how we can help you..." 
                    value={formData.message}
                    onChange={handleInputChange}
                    required 
                    rows={6}
                    className="transition-navbus focus:shadow-navbus-soft"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
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