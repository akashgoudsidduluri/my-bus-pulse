import { Link } from "react-router-dom";
import NavBusLogo from "@/assets/NavBus-logo.png";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-NavBus-blue">
              <img src={NavBusLogo} alt="NavBus Logo" className="w-8 h-8 rounded-lg" />
              NavBus
            </Link>
            <p className="text-muted-foreground">
              Revolutionizing smart mobility and journey management across India and beyond.
            </p>
            <p className="text-muted-foreground">
              Making public transport efficient, reliable, and user-friendly.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-NavBus">
                Home
              </Link>
              <Link to="/features" className="text-muted-foreground hover:text-primary transition-NavBus">
                Features
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-NavBus">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-NavBus">
                Contact
              </Link>
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-NavBus">
                Login
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Support</h4>
            <div className="flex flex-col space-y-2">
              <a 
                href="mailto:support@NavBus.com" 
                className="text-muted-foreground hover:text-primary transition-NavBus"
              >
                support@NavBus.com
              </a>
              <a 
                href="tel:+91-1800-NavBus" 
                className="text-muted-foreground hover:text-primary transition-NavBus"
              >
                1800-NavBus
              </a>
              <p className="text-muted-foreground">24/7 Customer Support</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Technology</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>✓ Real-time GPS tracking</p>
              <p>✓ IoT integration</p>
              <p>✓ ETM data processing</p>
              <p>✓ SMS gateway</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            &copy; 2024 NavBus. All rights reserved. | Transforming public transport across India
          </p>
        </div>
      </div>
    </footer>
  );
}