import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { useAuth } from "@/contexts/AuthContext";
import navbusLogo from "@/assets/navbus-logo.png";

export function Header() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/crowd-detection", label: "Crowd AI" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border transition-navbus">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-navbus-blue">
          <img src={navbusLogo} alt="NavBus Logo" className="w-8 h-8 rounded-lg" />
          NavBus
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={location.pathname === item.href ? "default" : "ghost"}
              className="transition-navbus"
            >
              <Link to={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <Button asChild variant="hero" className="hidden sm:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
          )}
          <ProfileDropdown />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}