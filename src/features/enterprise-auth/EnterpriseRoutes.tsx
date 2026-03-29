import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { EnterpriseAuthProvider, useEnterpriseAuth } from './EnterpriseAuthContext';
import { ABACProvider } from './ABACContext';
import EnterpriseLoginForm from './components/EnterpriseLoginForm';
import EnterpriseProtectedRoute from './components/EnterpriseProtectedRoute';
import EnterpriseDashboard from './pages/EnterpriseDashboard';

/**
 * Enterprise Login Route - redirects to dashboard if already authenticated
 */
const EnterpriseLoginRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useEnterpriseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/enterprise" replace />;
  }

  return <EnterpriseLoginForm />;
};

/**
 * Enterprise Routes Component
 *
 * This component defines all routes for the enterprise application.
 * It wraps routes with EnterpriseAuthProvider and ABACProvider for
 * authentication and access control.
 *
 * Routes:
 * - /enterprise - Dashboard (protected)
 * - /enterprise/login - Login page
 * - /enterprise/* - Future protected routes
 */
const EnterpriseRoutes: React.FC = () => {
  return (
    <EnterpriseAuthProvider>
      <ABACProvider>
        <Routes>
          {/* Enterprise Login */}
          <Route path="login" element={<EnterpriseLoginRoute />} />

          {/* Enterprise Dashboard - Protected */}
          <Route
            index
            element={
              <EnterpriseProtectedRoute>
                <EnterpriseDashboard />
              </EnterpriseProtectedRoute>
            }
          />

          {/* Example: Analytics page requiring specific permission */}
          {/*
          <Route
            path="analytics"
            element={
              <EnterpriseProtectedRoute requiredPermissions={['view_analytics']}>
                <AnalyticsPage />
              </EnterpriseProtectedRoute>
            }
          />
          */}

          {/* Example: Admin page requiring admin permission */}
          {/*
          <Route
            path="admin/*"
            element={
              <EnterpriseProtectedRoute requiredPermissions={['admin']}>
                <AdminRoutes />
              </EnterpriseProtectedRoute>
            }
          />
          */}

          {/* Catch-all redirect to enterprise dashboard */}
          <Route path="*" element={<Navigate to="/enterprise" replace />} />
        </Routes>
      </ABACProvider>
    </EnterpriseAuthProvider>
  );
};

export default EnterpriseRoutes;
