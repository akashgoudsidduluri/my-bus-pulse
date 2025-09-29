import { Shield } from "lucide-react";

export const AuthHeader = () => {
  return (
    <header className="bg-white border-b-2 border-[hsl(var(--gov-navy))] shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-[hsl(var(--gov-navy))] rounded-full">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[hsl(var(--gov-navy))]">
              NavBus
            </h1>
            <p className="text-sm text-[hsl(var(--gov-gray))] font-medium">
              Official Smart Travel Portal
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};