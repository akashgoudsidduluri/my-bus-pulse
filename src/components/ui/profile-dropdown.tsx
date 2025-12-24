import React, { useState } from 'react';
import { User, Phone, Settings, MessageCircle, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function ProfileDropdown() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      navigate('/profile');
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleProfileClick}
          className="rounded-full"
        >
          <User className="h-5 w-5" />
        </Button>

        <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign In Required</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You need to sign in to access your profile and use NavBus features.
              </p>
              <div className="flex space-x-3">
                <Button onClick={handleLoginRedirect} className="flex-1">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In / Sign Up
                </Button>
                <Button 
                  onClick={() => setShowLoginPrompt(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user?.profile?.full_name || ''}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile?section=personal')}>
          <User className="h-4 w-4 mr-2" />
          Personal Info
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/profile?section=contact')}>
          <Phone className="h-4 w-4 mr-2" />
          Contact Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/profile?section=settings')}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/contact')}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Us
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}