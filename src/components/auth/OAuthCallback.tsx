import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { oidcService } from '@/services/oidcService';
import { apiClient } from '@/utils/apiClient';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setOAuthUser } = useAuth();
  const { handleError } = useErrorHandler();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        // Handle the OAuth callback
        const user = await oidcService.signinRedirectCallback();

        if (user && user.profile) {
          try {
            const response = await apiClient.post('/api/auth/oauth/google', {
              idToken: user.id_token,
              accessToken: user.access_token,
            });

            if (response?.data?.success) {
              // Store JWT tokens from auth-service
              const {
                token,
                refresh_token,
                user: userData,
              } = response.data.data;

              // Set user in auth context with auth-service data
              await setOAuthUser({
                ...user,
                profile: {
                  ...user.profile,
                  ...userData,
                },
                access_token: token,
                refresh_token,
              });

              // Redirect to dashboard
              navigate('/neura', { replace: true });
            } else {
              throw new Error(response.data.message || 'Authentication failed');
            }
          } catch (authError: any) {
            // Use error handler - will check if already handled by interceptor
            const errorMessage = handleError(authError, {
              showToast: false,
              defaultMessage: 'Failed to verify with authentication service',
            });

            if (errorMessage) {
              throw new Error(errorMessage);
            }
          }
        } else {
          throw new Error('No user data received from OAuth provider');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError(
          error instanceof Error ? error.message : 'Authentication failed'
        );

        // Redirect to login page after error
        setTimeout(() => {
          navigate('/neura/login', { replace: true });
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, setOAuthUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isProcessing ? 'Completing Sign In...' : 'Redirecting...'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isProcessing
              ? 'Please wait while we complete your authentication.'
              : 'Taking you to your dashboard...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
