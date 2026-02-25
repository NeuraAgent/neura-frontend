import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination or default to /neura
  const from = location.state?.from?.pathname || '/neura';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(email, password);

      if (response.success) {
        // Redirect to intended destination
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
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
              {t('auth.loginTitle')}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('auth.username')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 text-base text-gray-900 placeholder-gray-400 transition-all duration-200"
                  placeholder={t('auth.username')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

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
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 text-base text-gray-900 placeholder-gray-400 transition-all duration-200"
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/neura/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full py-3.5 px-4 bg-[#6B6B6B] hover:bg-gray-900 text-white text-base font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>{t('auth.signingIn')}</span>
                  </div>
                ) : (
                  t('auth.continue')
                )}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="pt-6 space-y-4">
            <p className="text-center text-sm text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link
                to="/neura/signup"
                className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-150"
              >
                {t('auth.signUpNow')}
              </Link>
            </p>

            {/* Footer Links */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <button
                type="button"
                className="hover:text-gray-700 transition-colors duration-150"
                onClick={() => {
                  // TODO: Navigate to Terms of Use page
                }}
              >
                {t('auth.termsOfUse')}
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                className="hover:text-gray-700 transition-colors duration-150"
                onClick={() => {
                  // TODO: Navigate to Privacy Policy page
                }}
              >
                {t('auth.privacyPolicy')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
