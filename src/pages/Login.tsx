import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { FloatingElement, GlowEffect } from "@/components/ui/floating-effects";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowLeft, Shield } from "lucide-react";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic phone validation
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await sendOtp(phone);

      if (error) {
        toast({
          title: "Failed to Send OTP",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "OTP Sent!",
          description: "Please check your phone for the verification code."
        });
        setStep('otp');
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await verifyOtp(phone, otp);

      if (error) {
        toast({
          title: "Verification Failed",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome!",
          description: "You have successfully logged in."
        });
        navigate('/dashboard');
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

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      {/* Animated Background */}
      <AnimatedBackground variant="particles" intensity="low" color="blue" />
      
      <Header />
      
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <FloatingElement delay={0.5} duration={8} amplitude={15}>
            <GlowEffect color="rgba(59, 130, 246, 0.5)" intensity="medium">
              <div className="bg-gradient-card rounded-3xl p-8 shadow-navbus-large max-w-md w-full backdrop-blur-sm">
            <div className="text-center mb-8">
              <FloatingElement delay={1} duration={6} amplitude={10}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-navbus-blue/10 rounded-full mb-4">
                  {step === 'phone' ? (
                    <Phone className="w-8 h-8 text-navbus-blue" />
                  ) : (
                    <Shield className="w-8 h-8 text-navbus-blue" />
                  )}
                </div>
              </FloatingElement>
              <h1 className="text-3xl font-bold mb-2">
                {step === 'phone' ? 'Enter Phone Number' : 'Verify OTP'}
              </h1>
              <p className="text-muted-foreground">
                {step === 'phone' 
                  ? 'We\'ll send you a verification code via SMS' 
                  : `Enter the 6-digit code sent to ${phone}`
                }
              </p>
            </div>
            
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input 
                    id="phone"
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                    className="transition-navbus focus:shadow-navbus-soft text-center text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Include country code (e.g., +1 for US)
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-4 text-center">
                    Verification Code
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>

                <Button 
                  type="button"
                  variant="ghost" 
                  size="lg" 
                  className="w-full"
                  onClick={handleBackToPhone}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Phone Number
                </Button>
              </form>
            )}
              </div>
            </GlowEffect>
          </FloatingElement>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;