interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const calculateStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  if (!password) return null;

  const strength = calculateStrength(password);
  const percentage = (strength.score / 6) * 100;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[hsl(var(--gov-gray))]">Password Strength:</span>
        <span className={`text-xs font-medium ${
          strength.label === 'Weak' ? 'text-red-600' :
          strength.label === 'Medium' ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-[hsl(var(--gov-gray))]">
        <ul className="list-none space-y-0.5">
          <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
            ✓ At least 8 characters
          </li>
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
            ✓ One uppercase letter
          </li>
          <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
            ✓ One number
          </li>
        </ul>
      </div>
    </div>
  );
};