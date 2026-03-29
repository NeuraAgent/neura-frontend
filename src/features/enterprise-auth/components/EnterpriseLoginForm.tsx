import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Lock, Mail, Building2, AlertCircle } from 'lucide-react';

import { useEnterpriseAuth } from '../EnterpriseAuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

/**
 * Enterprise Login Form Component
 * Japanese SaaS 2026 style: clean, minimal, soft shadows, rounded-xl, neutral colors
 */
const EnterpriseLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useEnterpriseAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get redirect path from location state
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/enterprise';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      const response = await login(email, password);

      if (response.success) {
        // Redirect to original destination or enterprise dashboard
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Enterprise Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to your enterprise account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="you@enterprise.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">Admin:</span>
                <span>admin@enterprise.com / admin123</span>
              </div>
              <div className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">Manager:</span>
                <span>manager@enterprise.com / manager123</span>
              </div>
              <div className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">Analyst:</span>
                <span>analyst@enterprise.com / analyst123</span>
              </div>
              <div className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">Viewer:</span>
                <span>viewer@enterprise.com / viewer123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Protected by Enterprise Security
        </p>
      </div>
    </div>
  );
};

export default EnterpriseLoginForm;
