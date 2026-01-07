// src/utils/passwordValidator.js
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Must contain special character (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Usage in Register:
const handlePasswordChange = (value) => {
  setPassword(value);
  const validation = validatePassword(value);
  setPasswordErrors(validation.errors);
  setPasswordValid(validation.isValid);
};