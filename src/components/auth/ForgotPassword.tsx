import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { forgotPassword } = useAuth();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        setSuccess(true);
      } else {
        setError(
          response.message || 'Failed to send reset email. Please try again.'
        );
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                  {t('auth.checkYourEmail')}
                </h1>
                <p className="text-base text-gray-600 leading-relaxed">
                  {t('auth.resetLinkSent')}{' '}
                  <span className="font-semibold text-gray-900 break-all">
                    {email}
                  </span>
                </p>
                <p className="text-sm text-gray-500 pt-2">
                  {t('auth.didntReceiveEmail')}{' '}
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                    className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-150"
                  >
                    {t('auth.tryAgain')}
                  </button>
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/neura/login"
                className="w-full flex items-center justify-center py-3.5 px-4 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('auth.backToSignIn')}
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
              <Mail className="h-8 w-8 text-gray-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {t('auth.forgotPasswordTitle')}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {t('auth.forgotPasswordSubtitle')}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('auth.emailAddress')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 text-base text-gray-900 placeholder-gray-400 transition-all duration-200"
                placeholder={t('auth.enterEmail')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3.5 px-4 bg-[#6B6B6B] hover:bg-gray-900 text-white text-base font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>{t('auth.sending')}</span>
                  </div>
                ) : (
                  t('auth.sendResetLink')
                )}
              </button>

              <Link
                to="/neura/login"
                className="w-full flex items-center justify-center py-3.5 px-4 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('auth.backToSignIn')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
