export const AuthFooter = () => {
  return (
    <footer className="bg-[hsl(var(--gov-light-gray))] border-t border-[hsl(var(--border))] mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-[hsl(var(--gov-gray))]">
          <a 
            href="/privacy" 
            className="hover:text-[hsl(var(--gov-navy))] transition-colors font-medium"
          >
            Privacy Policy
          </a>
          <span className="hidden md:inline">|</span>
          <a 
            href="/terms" 
            className="hover:text-[hsl(var(--gov-navy))] transition-colors font-medium"
          >
            Terms of Service
          </a>
          <span className="hidden md:inline">|</span>
          <a 
            href="/support" 
            className="hover:text-[hsl(var(--gov-navy))] transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
        <div className="text-center mt-4 text-xs text-[hsl(var(--gov-gray))]">
          <p>© 2024 NavBus Official Portal. All rights reserved.</p>
          <p className="mt-1">Your information is protected under government data security standards.</p>
        </div>
      </div>
    </footer>
  );
};