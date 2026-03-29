import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useEnterpriseAuth } from '@/features/auth/EnterpriseAuthContext';
import enterpriseAuthService from '@/features/auth/authService';

export function EnterpriseLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useEnterpriseAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoUsers, setShowDemoUsers] = useState(false);

  const demoUsers = enterpriseAuthService.getMockUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
      navigate('/enterprise');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    }
  };

  const handleDemoLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setError('');

    try {
      await login(userEmail, 'demo-password');
      navigate('/enterprise');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 mb-4">
            <div className="text-white font-bold text-lg">N</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Neura Enterprise</h1>
          <p className="text-gray-500">AI-Powered Knowledge System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {(error || authError) && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error || authError}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Any password works in demo mode</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or try with demo users</span>
              </div>
            </div>

            {/* Demo Users Toggle */}
            <button
              type="button"
              onClick={() => setShowDemoUsers(!showDemoUsers)}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
            >
              {showDemoUsers ? 'Hide' : 'Show'} Demo Users
            </button>
          </form>

          {/* Demo Users List */}
          {showDemoUsers && (
            <div className="mt-6 space-y-2 border-t border-gray-200 pt-6">
              {demoUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user.email)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 transition group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded">
                          {user.attributes.role}
                        </span>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 rounded">
                          {user.attributes.department}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 ml-2 flex-shrink-0">→</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>This is a demo application</p>
          <p>Use any email with any password to test authentication</p>
        </div>
      </div>
    </div>
  );
}
