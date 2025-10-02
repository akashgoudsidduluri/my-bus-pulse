import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Full Name Required",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.phone.trim() || !/^\+?\d{10,15}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (10-15 digits)",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return false;
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms & Privacy Policy",
        description: "You must agree to the Terms & Privacy Policy to continue",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone_number: formData.phone
      });
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully."
      });
      
      navigate('/login', { 
        state: { message: "Registration successful. Please log in to access your account." }
      });
      
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthHeader />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[hsl(var(--border))] rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--gov-navy))] rounded-full mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[hsl(var(--gov-navy))] mb-2">
                Create Your Account
              </h1>
              <h2 className="text-lg font-semibold text-[hsl(var(--gov-gray))] mb-2">
                NavBus Official Portal
              </h2>
              <p className="text-[hsl(var(--gov-gray))] text-sm">
                Register for secure access to transportation services
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-2">
                  Full Name *
                </label>
                <Input 
                  id="fullName"
                  name="fullName"
                  type="text" 
                  placeholder="Enter your full legal name" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                  className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--gov-navy))] focus:ring-2 focus:ring-[hsl(var(--gov-navy))]/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-2">
                  Email Address *
                </label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="Enter your email address" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--gov-navy))] focus:ring-2 focus:ring-[hsl(var(--gov-navy))]/20"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-2">
                  Phone Number *
                </label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel" 
                  placeholder="+1 (555) 123-4567" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  required 
                  className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--gov-navy))] focus:ring-2 focus:ring-[hsl(var(--gov-navy))]/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password" 
                    value={formData.password}
                    onChange={handleInputChange}
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
                <PasswordStrengthMeter password={formData.password} />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[hsl(var(--gov-navy))] mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required 
                    className="h-12 border-2 border-[hsl(var(--border))] focus:border-[hsl(var(--gov-navy))] focus:ring-2 focus:ring-[hsl(var(--gov-navy))]/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--gov-gray))] hover:text-[hsl(var(--gov-navy))]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  className="mt-1 border-2 border-[hsl(var(--gov-navy))] data-[state=checked]:bg-[hsl(var(--gov-navy))]"
                />
                <label htmlFor="terms" className="text-sm text-[hsl(var(--gov-gray))] leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-[hsl(var(--gov-navy))] hover:underline font-semibold">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[hsl(var(--gov-navy))] hover:underline font-semibold">
                    Privacy Policy
                  </a>
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-[hsl(var(--gov-navy))] hover:bg-[hsl(var(--gov-navy-dark))] text-white font-bold text-lg"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? "Creating Account..." : "Register Securely"}
              </Button>

              <div className="text-center pt-6 mt-6 border-t border-[hsl(var(--border))]">
                <p className="text-[hsl(var(--gov-gray))] text-sm">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-[hsl(var(--gov-navy))] hover:text-[hsl(var(--gov-navy-light))] font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default Signup;