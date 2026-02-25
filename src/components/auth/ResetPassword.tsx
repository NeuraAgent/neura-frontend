import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import Logo from '@/components/Logo';
import { useLocale } from '@/contexts/LocaleContext';
import { authService } from '@/services/authService';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLocale();

  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setTokenError(true);
      setError(
        'Invalid or missing reset token. Please request a new password reset link.'
      );
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return t('auth.passwordMinLength');
    }
    if (!/[0-9]/.test(pwd)) {
      return t('auth.passwordNumber');
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(token, password);

      if (response.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/neura/login');
        }, 3000);
      } else {
        setError(
          response.message || 'Failed to reset password. Please try again.'
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
        {/* Neura Logo */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
          <Logo variant="icon" size="sm" />
        </div>

        {/* Error Card */}
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
            <div className="text-center space-y-5">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-red-50">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {t('auth.invalidResetLink')}
                </h1>
                <p className="text-base text-gray-600 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                to="/neura/forgot-password"
                className="w-full flex justify-center py-3.5 px-4 bg-[#6B6B6B] hover:bg-gray-900 text-white text-base font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('auth.requestNewResetLink')}
              </Link>
              <Link
                to="/neura/login"
                className="w-full flex justify-center py-3.5 px-4 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                {t('auth.backToSignIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
        {/* Neura Logo */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
          <Logo variant="icon" size="sm" />
        </div>

        {/* Success Card */}
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
            <div className="text-center space-y-5">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {t('auth.passwordResetSuccess')}
                </h1>
                <p className="text-base text-gray-600 leading-relaxed">
                  {t('auth.passwordResetSuccessMessage')}
                </p>
                <p className="text-sm text-gray-500 pt-2">
                  {t('auth.redirectingToSignIn')}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/neura/login"
                className="w-full flex justify-center py-3.5 px-4 bg-[#6B6B6B] hover:bg-gray-900 text-white text-base font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('auth.goToSignIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      {/* Neura Logo */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <Logo variant="icon" size="sm" />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gray-50 mb-6">
              <Lock className="h-8 w-8 text-gray-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {t('auth.resetPasswordTitle')}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {t('auth.resetPasswordSubtitle')}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('auth.newPassword')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 text-base text-gray-900 placeholder-gray-400 transition-all duration-200"
                    placeholder={t('auth.enterNewPassword')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-150"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t('auth.passwordRequirements')}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('auth.confirmNewPassword')}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 text-base text-gray-900 placeholder-gray-400 transition-all duration-200"
                    placeholder={t('auth.confirmNewPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-150"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full py-3.5 px-4 bg-[#6B6B6B] hover:bg-gray-900 text-white text-base font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>{t('auth.resetting')}</span>
                  </div>
                ) : (
                  t('auth.resetPassword')
                )}
              </button>

              <Link
                to="/neura/login"
                className="w-full flex justify-center py-3.5 px-4 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                {t('auth.backToSignIn')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
