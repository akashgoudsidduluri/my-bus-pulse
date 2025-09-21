import React, { useState, useEffect } from 'react';
import { User, Phone, Settings, MessageCircle, LogOut, Bell, Moon, Sun, Shield, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface UserData {
  firstName: string;
  surname: string;
  dateOfBirth: string;
  location: string;
  contactNumber: string;
  phoneNumber: string;
  email: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showOtpInterface, setShowOtpInterface] = useState(false);
  const [verificationPhone, setVerificationPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [otpTimer, setOtpTimer] = useState<NodeJS.Timeout | null>(null);
  const [otpError, setOtpError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSessionId, setOtpSessionId] = useState('');
  
  // User data from Supabase profile
  const [userData, setUserData] = useState({
    firstName: user?.profile?.first_name || '',
    surname: user?.profile?.last_name || '',
    dateOfBirth: user?.profile?.date_of_birth || '',
    location: user?.profile?.location || '',
    contactNumber: user?.profile?.phone_number || '',
    phoneNumber: user?.profile?.phone_number || '',
    email: user?.email || ''
  });

  // Handle section from URL params
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && ['personal', 'contact', 'settings', 'support'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'contact', label: 'Contact Details', icon: Phone },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Contact Us', icon: MessageCircle }
  ];

  const handleInputChange = async (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    
    // Update profile in database
    const profileData: any = {};
    if (field === 'firstName') profileData.first_name = value;
    else if (field === 'surname') profileData.last_name = value;
    else if (field === 'dateOfBirth') profileData.date_of_birth = value;
    else if (field === 'location') profileData.location = value;
    else if (field === 'contactNumber' || field === 'phoneNumber') profileData.phone_number = value;
    
    if (Object.keys(profileData).length > 0) {
      await updateProfile(profileData);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  const handleSmsVerification = () => {
    if (userData.contactNumber || userData.phoneNumber) {
      const savedNumber = userData.contactNumber || userData.phoneNumber;
      setVerificationPhone(savedNumber);
    } else {
      setVerificationPhone('');
    }
    setShowPhoneVerification(true);
  };

  const handleSendOtp = async () => {
    if (!verificationPhone) {
      alert('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtpSessionId('mock-session-id');
      setShowOtpInterface(true);
      setShowPhoneVerification(false);
      
      // Start countdown timer
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setOtpTimer(timer);
      
      alert(`OTP sent successfully to ${verificationPhone}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    try {
      // Simulate API call - in real app, this would verify with your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success for demo (in real app, check actual OTP)
      if (otp === '123456') {
        if (otpTimer) clearInterval(otpTimer);
        setSmsEnabled(true);
        setShowOtpInterface(false);
        setOtp('');
        setCountdown(60);
        setOtpError('');
        setAttemptsLeft(3);
        setOtpSessionId('');
        alert('SMS verification successful! You will now receive SMS notifications from NavBus.');
      } else {
        setAttemptsLeft(prev => prev - 1);
        setOtpError('Invalid OTP. Please try again.');
        
        if (attemptsLeft <= 1) {
          setShowOtpInterface(false);
          if (otpTimer) clearInterval(otpTimer);
          setOtp('');
          setCountdown(60);
          alert('Maximum attempts exceeded. Please try again later.');
        } else {
          setOtp('');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtpSessionId('new-session-id');
      setCountdown(60);
      setOtpError('');
      setAttemptsLeft(3);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setOtpTimer(timer);
      
      alert('New OTP has been sent to your mobile number');
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Personal Information</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={userData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="surname">Surname</Label>
          <Input
            id="surname"
            value={userData.surname}
            onChange={(e) => handleInputChange('surname', e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={userData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={userData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="mt-2"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            type="tel"
            value={userData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
      <div className="pt-4">
        <Button variant="navbus">Save Changes</Button>
      </div>
    </div>
  );

  const renderContactDetails = () => (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Contact Details</CardTitle>
      </CardHeader>
      <div className="space-y-6">
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={userData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={userData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
      <div className="pt-4">
        <Button variant="navbus">Update Contact Info</Button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Settings</CardTitle>
      </CardHeader>
      
      {/* Phone Verification Dialog */}
      <Dialog open={showPhoneVerification} onOpenChange={setShowPhoneVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {userData.contactNumber || userData.phoneNumber ? 
                'Verify your phone number to receive SMS notifications' : 
                'Enter your mobile number to receive SMS notifications'
              }
            </p>
            
            <div>
              <Label htmlFor="verificationPhone">Mobile Number</Label>
              <Input
                id="verificationPhone"
                type="tel"
                value={verificationPhone}
                onChange={(e) => setVerificationPhone(e.target.value)}
                placeholder="Enter mobile number"
                className="mt-2"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleSendOtp}
                disabled={!verificationPhone || isLoading}
                className="flex-1"
                variant="navbus"
              >
                {(userData.contactNumber || userData.phoneNumber) && 
                 verificationPhone === (userData.contactNumber || userData.phoneNumber) ? 
                  `Continue with ${verificationPhone}` : 'Send OTP'}
              </Button>
              <Button
                onClick={() => setShowPhoneVerification(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpInterface} onOpenChange={setShowOtpInterface}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Please enter the one-time password</p>
            <p className="text-sm text-muted-foreground">sent to {verificationPhone}</p>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-4">
                {formatTime(countdown)}
              </div>
            </div>
            
            <div className="flex justify-center">
              <InputOTP value={otp} onChange={setOtp} maxLength={6}>
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
            
            {otpError && (
              <div className="text-center">
                <p className="text-sm text-destructive">{otpError}</p>
              </div>
            )}
            
            <div className="text-center">
              {countdown > 0 ? (
                <span className="text-sm text-muted-foreground">Resend OTP in {formatTime(countdown)}</span>
              ) : (
                <Button
                  onClick={handleResendOtp}
                  variant="link"
                  className="text-sm"
                >
                  Not received any OTP? Resend
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleOtpSubmit}
                disabled={isLoading || otp.length !== 6}
                className="flex-1"
                variant="navbus"
              >
                {isLoading ? 'Verifying...' : 'Submit'}
              </Button>
              <Button
                onClick={() => {
                  setShowOtpInterface(false);
                  if (otpTimer) clearInterval(otpTimer);
                  setOtp('');
                  setCountdown(60);
                  setOtpError('');
                  setAttemptsLeft(3);
                }}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive push notifications for bus updates</p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Receive SMS</h3>
                <p className="text-sm text-muted-foreground">Get SMS notifications for important updates</p>
              </div>
            </div>
            {smsEnabled ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-green-600 font-medium">Verified</span>
                <Switch
                  checked={smsEnabled}
                  onCheckedChange={setSmsEnabled}
                />
              </div>
            ) : (
              <Button
                onClick={handleSmsVerification}
                variant="navbus"
                size="sm"
              >
                Verify
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Privacy</h3>
                <p className="text-sm text-muted-foreground">Manage your privacy settings</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Language</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">English</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <div className="pt-4 border-t">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContactUs = () => (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Contact Us</CardTitle>
      </CardHeader>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4">
            Need help or have questions about NavBus? We're here to assist you!
          </p>
          <Button
            onClick={handleContactUs}
            variant="navbus"
          >
            Go to Contact Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'contact':
        return renderContactDetails();
      case 'settings':
        return renderSettings();
      case 'support':
        return renderContactUs();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl font-bold text-navbus-blue">NavBus</h1>
            <span className="ml-4 text-muted-foreground">Profile</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar Menu */}
          <Card className="w-72">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{userData.firstName} {userData.surname}</h3>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Right Content Panel */}
          <Card className="flex-1">
            <CardContent className="p-8">
              <div className="transition-all duration-300 ease-in-out">
                {renderContent()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;