import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowLeft, Shield, Mail, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Show success message from signup if present
  useEffect(() => {
    if (location.state?.message) {
      toast({
        title: "Account Created Successfully",
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement email/password login with Supabase
      // For now, simulate login success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Login Successful",
        description: "Welcome back to NavBus Portal"
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          title: "OTP Sent Successfully",
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

  const handleBackToCredentials = () => {
    setStep('credentials');
    setOtp("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthHeader />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[hsl(var(--border))] rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--gov-navy))] rounded-full mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[hsl(var(--gov-navy))] mb-2">
                Secure Login
              </h1>
              <p className="text-[hsl(var(--gov-gray))] text-sm">
                Access your NavBus Official Portal account
              </p>
              <p className="text-xs text-[hsl(var(--gov-gray))] mt-2 italic">
                Your information is protected under data security standards.
              </p>
            </div>

            {step === 'credentials' && (
              <>
                {/* Login Method Toggle */}
                <div className="mb-6">
                  <div className="flex border border-[hsl(var(--border))] rounded-lg p-1 bg-[hsl(var(--gov-light-gray))]">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        loginMethod === 'email'
                          ? 'bg-[hsl(var(--gov-navy))] text-white shadow-sm'
                          : 'text-[hsl(var(--gov-gray))] hover:text-[hsl(var(--gov-navy))]'
                      }`}
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        loginMethod === 'phone'
                          ? 'bg-[hsl(var(--gov-navy))] text-white shadow-sm'
                          : 'text-[hsl(var(--gov-gray))] hover:text-[hsl(var(--gov-navy))]'
                      }`}
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {step === 'credentials' ? (
              <>
                {loginMethod === 'email' ? (
                  <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-2">
                        Email Address
                      </label>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="Enter your email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--gov-navy))] focus:ring-2 focus:ring-[hsl(var(--gov-navy))]/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input 
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                          className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--gov-navy))] focus:ring-2 focus:ring-[hsl(var(--gov-navy))]/20 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--gov-gray))] hover:text-[hsl(var(--gov-navy))]"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-[hsl(var(--gov-navy))] hover:bg-[hsl(var(--gov-navy-dark))] text-white font-bold text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Secure Login"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-2">
                        Phone Number
                      </label>
                      <Input 
                        id="phone"
                        type="tel" 
                        placeholder="+1 (555) 123-4567" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required 
                        className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--gov-navy))] focus:ring-2 focus:ring-[hsl(var(--gov-navy))]/20 text-center text-lg"
                      />
                      <p className="text-xs text-[hsl(var(--gov-gray))] mt-2">
                        Include country code (e.g., +1 for US)
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-[hsl(var(--gov-navy))] hover:bg-[hsl(var(--gov-navy-dark))] text-white font-bold text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Security Code"}
                    </Button>
                  </form>
                )}
              </>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[hsl(var(--gov-navy))] mb-2">
                    Verify Security Code
                  </h2>
                  <p className="text-[hsl(var(--gov-gray))] text-sm">
                    Enter the 6-digit code sent to {phone}
                  </p>
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-4 text-center">
                    Security Verification Code
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2 border-[hsl(var(--border))]" />
                        <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2 border-[hsl(var(--border))]" />
                        <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2 border-[hsl(var(--border))]" />
                        <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2 border-[hsl(var(--border))]" />
                        <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2 border-[hsl(var(--border))]" />
                        <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2 border-[hsl(var(--border))]" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[hsl(var(--gov-navy))] hover:bg-[hsl(var(--gov-navy-dark))] text-white font-bold text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Access Portal"}
                </Button>

                <Button 
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-[hsl(var(--gov-navy))] text-[hsl(var(--gov-navy))] hover:bg-[hsl(var(--gov-light-gray))] font-semibold"
                  onClick={handleBackToCredentials}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login Options
                </Button>
              </form>
            )}
            
            {step === 'credentials' && (
              <div className="text-center pt-6 mt-6 border-t border-[hsl(var(--border))]">
                <p className="text-[hsl(var(--gov-gray))] text-sm">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-[hsl(var(--gov-navy))] hover:text-[hsl(var(--gov-navy-light))] font-semibold transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default Login;