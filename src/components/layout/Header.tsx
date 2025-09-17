import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NavBusLogo from "@/assets/NavBus-logo.png";

export function Header() {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border transition-NavBus">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-NavBus-blue">
          <img src={NavBusLogo} alt="NavBus Logo" className="w-8 h-8 rounded-lg" />
          NavBus
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={location.pathname === item.href ? "default" : "ghost"}
              className="transition-NavBus"
            >
              <Link to={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="hero" className="hidden sm:inline-flex">
            <Link to="/login">Login</Link>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}