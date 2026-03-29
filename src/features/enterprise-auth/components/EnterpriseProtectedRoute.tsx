import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useEnterpriseAuth } from '../EnterpriseAuthContext';

interface EnterpriseProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Required permissions for accessing this route (optional)
   * If not provided, only authentication is checked
   */
  requiredPermissions?: string[];
}

/**
 * Enterprise Protected Route Component
 * Protects enterprise routes from unauthorized access
 * Redirects to /enterprise/login if not authenticated
 */
const EnterpriseProtectedRoute: React.FC<EnterpriseProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
}) => {
  const { isAuthenticated, isLoading, user } = useEnterpriseAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-600 mx-auto" />
          <p className="mt-4 text-gray-600 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/enterprise/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              You don&apos;t have permission to access this resource.
            </p>
            <p className="text-sm text-gray-500">
              Required permissions: {requiredPermissions.join(', ')}
            </p>
          </div>
        </div>
      );
    }
  }

  // Render protected content
  return <>{children}</>;
};

export default EnterpriseProtectedRoute;
