import { z } from 'zod';

// Vietnam phone number validation
export const validateVietnamPhoneNumber = (phone: string): boolean => {
  // Remove all spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Vietnam phone number patterns
  const patterns = [
    // Mobile numbers starting with 03, 05, 07, 08, 09 (10 digits total)
    /^(03|05|07|08|09)[0-9]{8}$/,
    // Mobile numbers with country code +84
    /^\+84(3|5|7|8|9)[0-9]{8}$/,
    // Mobile numbers with country code 84 (without +)
    /^84(3|5|7|8|9)[0-9]{8}$/,
    // Landline numbers (area code + 7-8 digits)
    /^(02[0-9])[0-9]{7,8}$/,
    // Landline with country code
    /^\+84(2[0-9])[0-9]{7,8}$/,
    /^84(2[0-9])[0-9]{7,8}$/,
  ];

  return patterns.some(pattern => pattern.test(cleanPhone));
};

// Password strength validation
export const validatePasswordStrength = (
  password: string
): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  // Uppercase letter
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one uppercase letter');
  }

  // Lowercase letter
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one lowercase letter');
  }

  // Number
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one number');
  }

  // Special character
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one special character');
  }

  // Common patterns check
  const commonPatterns = [/123456/, /password/i, /qwerty/i, /abc123/i];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score -= 1;
    feedback.push('Password contains common patterns');
  }

  return {
    isValid: score >= 4,
    score: Math.max(0, Math.min(5, score)),
    feedback,
  };
};

// Sign-up form validation schema
export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(
        /^[a-zA-ZÀ-ỹ\s]+$/,
        'First name can only contain letters and spaces'
      ),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(
        /^[a-zA-ZÀ-ỹ\s]+$/,
        'Last name can only contain letters and spaces'
      ),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters'),

    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .refine(validateVietnamPhoneNumber, {
        message: 'Please enter a valid Vietnam phone number',
      }),

    password: z
      .string()
      .min(1, 'Password is required')
      .refine(password => validatePasswordStrength(password).isValid, {
        message: 'Password does not meet security requirements',
      }),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    dateOfBirth: z
      .string()
      .optional()
      .refine(
        date => {
          if (!date) return true;
          const birthDate = new Date(date);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          return age >= 13 && age <= 120;
        },
        {
          message: 'You must be between 13 and 120 years old',
        }
      ),

    gender: z.enum(['male', 'female', 'other']).optional(),

    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Format Vietnam mobile numbers
  if (/^(03|05|07|08|09)[0-9]{8}$/.test(cleanPhone)) {
    return cleanPhone.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3');
  }

  // Format with country code
  if (/^\+84(3|5|7|8|9)[0-9]{8}$/.test(cleanPhone)) {
    return cleanPhone.replace(/^\+84(\d)(\d{3})(\d{4})$/, '+84 $1 $2 $3');
  }

  return phone;
};

// Get password strength color
export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-blue-500';
    case 5:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

// Get password strength text
export const getPasswordStrengthText = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'Very Weak';
    case 2:
      return 'Weak';
    case 3:
      return 'Fair';
    case 4:
      return 'Good';
    case 5:
      return 'Strong';
    default:
      return 'Unknown';
  }
};
