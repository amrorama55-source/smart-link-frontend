export default function PasswordStrength({ password }) {
  const calculateStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    
    // Has lowercase
    if (/[a-z]/.test(pass)) score += 1;
    
    // Has uppercase
    if (/[A-Z]/.test(pass)) score += 1;
    
    // Has number
    if (/[0-9]/.test(pass)) score += 1;
    
    // Has special character
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { score, label: 'Good', color: 'bg-green-500' };
    return { score, label: 'Strong', color: 'bg-green-600' };
  };
  
  const strength = calculateStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">Password strength:</span>
        <span className={`text-xs font-medium ${
          strength.label === 'Weak' ? 'text-red-600' :
          strength.label === 'Fair' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 6) * 100}%` }}
        />
      </div>
      {strength.score < 4 && (
        <ul className="mt-2 text-xs text-gray-600 space-y-1">
          {password.length < 8 && <li>• At least 8 characters</li>}
          {!/[A-Z]/.test(password) && <li>• One uppercase letter</li>}
          {!/[a-z]/.test(password) && <li>• One lowercase letter</li>}
          {!/[0-9]/.test(password) && <li>• One number</li>}
          {!/[^A-Za-z0-9]/.test(password) && <li>• One special character</li>}
        </ul>
      )}
    </div>
  );
}