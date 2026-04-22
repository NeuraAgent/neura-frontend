import React from 'react';
import { Navigate } from 'react-router-dom';

import { useEnterpriseAuth } from './EnterpriseAuthContext';

interface EnterpriseProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route wrapper for enterprise routes
 * Redirects to login if not authenticated
 */
export function EnterpriseProtectedRoute({
  children,
}: EnterpriseProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useEnterpriseAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/enterprise/login" replace />;
  }

  return <>{children}</>;
}

export default EnterpriseProtectedRoute;
