// src/utils/validation.js
// Complete validation utilities with security checks

/**
 * Validate URL with security checks
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid and safe
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    
    // Block dangerous protocols
    const dangerousProtocols = [
      'javascript:',
      'data:',
      'vbscript:',
      'file:',
      'about:',
      'blob:'
    ];
    
    if (dangerousProtocols.includes(parsed.protocol.toLowerCase())) {
      return false;
    }
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Block localhost and private IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsed.hostname.toLowerCase();
      
      // Block localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
        return false;
      }
      
      // Block private IP ranges (basic check)
      if (hostname.startsWith('192.168.') || 
          hostname.startsWith('10.') || 
          hostname.startsWith('172.')) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Additional checks
  if (email.length > 254) return false; // RFC 5321
  if (email.includes('..')) return false; // No consecutive dots
  
  return emailRegex.test(email);
};

/**
 * Validate password with strength requirements
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password)) {
    errors.push('Must contain at least one special character');
  }
  
  // Check for common passwords
  const commonPasswords = [
    'password', 'password123', '12345678', 'qwerty', 
    'abc123', '111111', 'letmein', 'welcome'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calculate password strength
 * @param {string} password - Password to check
 * @returns {string} - Strength level: weak, medium, strong
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password)) score++;
  if (password.length >= 16) score++;
  
  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  return 'strong';
};

/**
 * Validate custom alias for short links
 * @param {string} alias - Alias to validate
 * @returns {Object} - Validation result
 */
export const validateCustomAlias = (alias) => {
  if (!alias) {
    return { isValid: true, error: null };
  }
  
  if (typeof alias !== 'string') {
    return { isValid: false, error: 'Alias must be a string' };
  }
  
  // Check length
  if (alias.length < 3) {
    return {
      isValid: false,
      error: 'Alias must be at least 3 characters'
    };
  }
  
  if (alias.length > 50) {
    return {
      isValid: false,
      error: 'Alias must be less than 50 characters'
    };
  }
  
  // Allow only alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
    return {
      isValid: false,
      error: 'Only letters, numbers, hyphens, and underscores allowed'
    };
  }
  
  // Must start and end with alphanumeric
  if (!/^[a-zA-Z0-9].*[a-zA-Z0-9]$/.test(alias)) {
    return {
      isValid: false,
      error: 'Must start and end with a letter or number'
    };
  }
  
  // Reserved words
  const reservedWords = [
    'admin', 'api', 'auth', 'login', 'register', 'dashboard',
    'analytics', 'settings', 'help', 'support', 'about',
    'terms', 'privacy', 'contact', 'blog', 'docs'
  ];
  
  if (reservedWords.includes(alias.toLowerCase())) {
    return {
      isValid: false,
      error: 'This alias is reserved'
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Sanitize text input to prevent XSS
 * @param {string} input - Text to sanitize
 * @param {number} maxLength - Maximum length
 * @returns {string} - Sanitized text
 */
export const sanitizeInput = (input, maxLength = 500) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove potentially dangerous characters
    .replace(/[<>]/g, '');
};

/**
 * Validate phone number (international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone is valid
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check length (7-15 digits for international numbers)
  if (cleaned.length < 7 || cleaned.length > 15) return false;
  
  return true;
};

/**
 * Validate credit card number using Luhn algorithm
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} - Whether card number is valid
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return false;
  
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if only digits
  if (!/^\d+$/.test(cleaned)) return false;
  
  // Check length
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate date is in the future
 * @param {string} dateString - Date to validate
 * @returns {Object} - Validation result
 */
export const validateFutureDate = (dateString) => {
  if (!dateString) {
    return { isValid: true, error: null };
  }
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (date <= now) {
    return { isValid: false, error: 'Date must be in the future' };
  }
  
  // Check if date is too far in the future (10 years)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);
  
  if (date > maxDate) {
    return { isValid: false, error: 'Date cannot be more than 10 years in the future' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Object} - Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Both dates are required' };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (start >= end) {
    return { isValid: false, error: 'End date must be after start date' };
  }
  
  // Check if range is too long (1 year max)
  const maxDuration = 365 * 24 * 60 * 60 * 1000; // 1 year in ms
  if (end - start > maxDuration) {
    return { isValid: false, error: 'Date range cannot exceed 1 year' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options;
  
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  // Check size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / 1024 / 1024).toFixed(1);
    return { isValid: false, error: `File size must be less than ${sizeMB}MB` };
  }
  
  // Check type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  // Check extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return { isValid: false, error: 'File extension not allowed' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate array of values
 * @param {Array} arr - Array to validate
 * @param {Function} validator - Validator function for each item
 * @returns {Object} - Validation result with invalid items
 */
export const validateArray = (arr, validator) => {
  if (!Array.isArray(arr)) {
    return { isValid: false, errors: ['Not an array'], invalidItems: [] };
  }
  
  const invalidItems = [];
  const errors = [];
  
  arr.forEach((item, index) => {
    const result = validator(item);
    if (!result.isValid) {
      invalidItems.push({ index, item, errors: result.errors || [result.error] });
      errors.push(`Item ${index + 1}: ${result.error || result.errors.join(', ')}`);
    }
  });
  
  return {
    isValid: invalidItems.length === 0,
    errors,
    invalidItems
  };
};

/**
 * Check if string contains SQL injection patterns
 * @param {string} input - Input to check
 * @returns {boolean} - Whether input is suspicious
 */
export const detectSQLInjection = (input) => {
  if (typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|\||;|'|"|`)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate JSON string
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} - Validation result with parsed data
 */
export const validateJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    return { isValid: true, data: parsed, error: null };
  } catch (error) {
    return { isValid: false, data: null, error: error.message };
  }
};

export default {
  validateUrl,
  validateEmail,
  validatePassword,
  validateCustomAlias,
  sanitizeInput,
  validatePhone,
  validateCreditCard,
  validateFutureDate,
  validateDateRange,
  validateFile,
  validateArray,
  detectSQLInjection,
  validateJSON
};