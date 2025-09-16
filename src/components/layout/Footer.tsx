import { Link } from "react-router-dom";
import safariLogo from "@/assets/safari-logo.png";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-safari-blue">
              <img src={safariLogo} alt="Safari Logo" className="w-8 h-8 rounded-lg" />
              Safari
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
              <Link to="/" className="text-muted-foreground hover:text-primary transition-safari">
                Home
              </Link>
              <Link to="/features" className="text-muted-foreground hover:text-primary transition-safari">
                Features
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-safari">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-safari">
                Contact
              </Link>
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-safari">
                Login
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Support</h4>
            <div className="flex flex-col space-y-2">
              <a 
                href="mailto:support@safari.com" 
                className="text-muted-foreground hover:text-primary transition-safari"
              >
                support@safari.com
              </a>
              <a 
                href="tel:+91-1800-SAFARI" 
                className="text-muted-foreground hover:text-primary transition-safari"
              >
                1800-SAFARI
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
            &copy; 2024 Safari. All rights reserved. | Transforming public transport across India
          </p>
        </div>
      </div>
    </footer>
  );
}