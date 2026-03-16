import { Eye, EyeOff } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface SimpleSignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  bgColor: string;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SimpleSignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();
  const { t } = useLocale();
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  // Calculate password strength
  const passwordStrength = useMemo((): PasswordStrength => {
    const password = formData.password;

    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: false, // Not required anymore
      hasLowerCase: false, // Not required anymore
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: false, // Not required anymore
    };

    // Only count required requirements (minLength, hasNumber)
    const requiredMet = [requirements.minLength, requirements.hasNumber].filter(
      Boolean
    ).length;

    let score = 0;
    let label = t('auth.passwordVeryWeak');
    let color = 'text-red-600';
    let bgColor = 'bg-red-500';

    if (requiredMet === 0) {
      score = 0;
      label = t('auth.passwordVeryWeak');
    } else if (requiredMet === 1) {
      score = 1;
      label = t('auth.passwordWeak');
      color = 'text-orange-600';
      bgColor = 'bg-orange-500';
    } else {
      score = 2;
      label = t('auth.passwordStrong');
      color = 'text-green-600';
      bgColor = 'bg-green-500';
    }

    return { score, label, color, bgColor, requirements };
  }, [formData.password, t]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Vui lòng điền đầy đủ thông tin');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setFieldErrors({ password: 'Mật khẩu phải có ít nhất 8 ký tự' });
      setIsLoading(false);
      return;
    }

    try {
      // Call sign-up API with simplified data
      const response = await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: '', // Optional - empty string for simplified flow
        dateOfBirth: '', // Optional - empty string for simplified flow
        gender: undefined, // Optional
        acceptTerms: true, // Auto-accept for simplified flow
      });

      if (response.success) {
        setSuccess(true);
        setError('');
        setFieldErrors({});
        // Show success message for 2 seconds then redirect to login
        setTimeout(() => {
          navigate('/neura/login');
        }, 3000);
      } else {
        // Handle validation errors from API
        if (response.error === 'VALIDATION_ERROR' && response.details) {
          const errors: Record<string, string> = {};
          response.details.forEach((detail: any) => {
            errors[detail.path] = detail.msg;
          });
          setFieldErrors(errors);
        } else {
          setError(response.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
      }
    } catch (err: any) {
      const errorMessage = handleError(err, {
        showToast: false,
        defaultMessage: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.',
      });

      if (errorMessage) {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      {/* Neura Logo */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <Logo variant="icon" size="sm" />
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md">
        {/* Card with subtle elevation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {t('auth.signupTitle')}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {t('auth.signupSubtitle')}
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="w-full">
            {success ? (
              <div className="text-center space-y-5 py-8">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {t('auth.signupSuccess')}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {t('auth.checkEmail')}{' '}
                    <strong className="text-gray-900 break-all">
                      {formData.email}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('auth.verifyEmailPrompt')}
                  </p>
                  <p className="text-sm text-gray-400 mt-6">
                    {t('auth.redirecting')}
                  </p>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Name Fields Group */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t('auth.firstName')}
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-base text-gray-900 transition-all duration-200 ${
                          fieldErrors.firstName
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-200 focus:border-gray-300'
                        }`}
                        placeholder=""
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {fieldErrors.firstName && (
                        <p className="mt-2 text-sm text-red-600">
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t('auth.lastName')}
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-base text-gray-900 transition-all duration-200 ${
                          fieldErrors.lastName
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-200 focus:border-gray-300'
                        }`}
                        placeholder=""
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {fieldErrors.lastName && (
                        <p className="mt-2 text-sm text-red-600">
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email - Primary Focus */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('auth.email')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-base text-gray-900 transition-all duration-200 ${
                        fieldErrors.email
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-gray-200 focus:border-gray-300'
                      }`}
                      placeholder=""
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    {fieldErrors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Group */}
                  <div className="space-y-4">
                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t('auth.password')}
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-base text-gray-900 transition-all duration-200 ${
                            fieldErrors.password
                              ? 'border-red-300 focus:border-red-400'
                              : 'border-gray-200 focus:border-gray-300'
                          }`}
                          placeholder=""
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-150"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      {formData.password && (
                        <div className="mt-3 space-y-2.5">
                          {/* Strength Bar */}
                          <div className="flex gap-1.5">
                            {[0, 1, 2, 3].map(index => (
                              <div
                                key={index}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                  index < passwordStrength.score
                                    ? passwordStrength.bgColor
                                    : 'bg-gray-100'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Strength Label */}
                          <p
                            className={`text-sm font-medium ${passwordStrength.color}`}
                          >
                            {passwordStrength.label}
                          </p>

                          {/* Requirements Checklist */}
                          <div className="space-y-1.5 pt-1">
                            <p
                              className={`text-xs transition-colors duration-150 ${passwordStrength.requirements.minLength ? 'text-green-600' : 'text-gray-500'}`}
                            >
                              {passwordStrength.requirements.minLength
                                ? '✓'
                                : '○'}{' '}
                              {t('auth.passwordMinLength')}
                            </p>
                            <p
                              className={`text-xs transition-colors duration-150 ${passwordStrength.requirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}
                            >
                              {passwordStrength.requirements.hasNumber
                                ? '✓'
                                : '○'}{' '}
                              {t('auth.passwordNumber')}
                            </p>
                          </div>
                        </div>
                      )}

                      {fieldErrors.password && (
                        <p className="mt-2 text-sm text-red-600">
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t('auth.confirmPassword')}
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-base text-gray-900 transition-all duration-200 ${
                            fieldErrors.confirmPassword
                              ? 'border-red-300 focus:border-red-400'
                              : 'border-gray-200 focus:border-gray-300'
                          }`}
                          placeholder=""
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-150"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>

                      {fieldErrors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">
                          {fieldErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button - Match Login Color */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-[#6B6B6B] hover:bg-gray-900 text-white text-base font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>{t('auth.processing')}</span>
                      </div>
                    ) : (
                      t('auth.verifyEmail')
                    )}
                  </button>
                </div>

                {/* Footer Links - Subtle & Respectful */}
                <div className="pt-6 space-y-4">
                  <p className="text-center text-sm text-gray-600">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link
                      to="/neura/login"
                      className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-150"
                    >
                      {t('auth.signInNow')}
                    </Link>
                  </p>

                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <Link
                      to="/terms"
                      className="hover:text-gray-700 transition-colors duration-150"
                    >
                      {t('auth.termsOfUse')}
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link
                      to="/privacy"
                      className="hover:text-gray-700 transition-colors duration-150"
                    >
                      {t('auth.privacyPolicy')}
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
