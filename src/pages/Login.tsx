import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowLeft, Shield } from "lucide-react";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Show success message from signup if present
  useEffect(() => {
    if (location.state?.message) {
      toast({
        title: "Success",
        description: location.state.message
      });
      // Clear the message from location state
      navigate('/login', { replace: true });
    }
  }, [location.state, toast, navigate]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const validatePhone = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (digitsOnly.length <= 10) {
      setPhone(digitsOnly);
      
      // Validate with regex
      const regex = /^[6-9][0-9]{9}$/;
      if (digitsOnly.length === 10 && !regex.test(digitsOnly)) {
        setPhoneError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      } else if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        setPhoneError("");
      } else if (digitsOnly.length === 10 && regex.test(digitsOnly)) {
        setPhoneError("");
      }
    }
  };

  const isPhoneValid = () => {
    const regex = /^[6-9][0-9]{9}$/;
    return regex.test(phone);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPhoneValid()) {
      setPhoneError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    setIsLoading(true);

    // Prefix +91 to the phone number
    const phoneWithCode = `+91${phone}`;

    try {
      const { error } = await sendOtp(phoneWithCode);

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
      // Use phone with +91 prefix for verification
      const phoneWithCode = `+91${phone}`;
      const { error } = await verifyOtp(phoneWithCode, otp);

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
    setPhoneError("");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="bg-gradient-card rounded-3xl p-8 shadow-navbus-large max-w-md w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-navbus-blue/10 rounded-full mb-4">
                {step === 'phone' ? (
                  <Phone className="w-8 h-8 text-navbus-blue" />
                ) : (
                  <Shield className="w-8 h-8 text-navbus-blue" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {step === 'phone' ? 'Enter Phone Number' : 'Verify OTP'}
              </h1>
              <p className="text-muted-foreground">
                {step === 'phone' 
                  ? 'We\'ll send you a verification code via SMS' 
                  : `Enter the 6-digit code sent to +91${phone}`
                }
              </p>
            </div>
            
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Enter your 10-digit mobile number
                  </label>
                  <Input 
                    id="phone"
                    type="tel" 
                    placeholder="9876543210" 
                    value={phone}
                    onChange={(e) => validatePhone(e.target.value)}
                    maxLength={10}
                    required 
                    className={`transition-navbus focus:shadow-navbus-soft text-center text-lg ${phoneError ? 'border-destructive' : ''}`}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    No need to enter +91. Just type your mobile number.
                  </p>
                  {phoneError && (
                    <p className="text-xs text-destructive mt-2">
                      {phoneError}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading || !isPhoneValid()}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;