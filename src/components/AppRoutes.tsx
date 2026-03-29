import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ForgotPassword from '@/components/auth/ForgotPassword';
import Login from '@/components/auth/Login';
import OAuthCallback from '@/components/auth/OAuthCallback';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ResetPassword from '@/components/auth/ResetPassword';
import SignUp from '@/components/auth/SignUp';
import SilentCallback from '@/components/auth/SilentCallback';
import VerifyEmail from '@/components/auth/VerifyEmail';
import Dashboard from '@/components/Dashboard';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import NotFound from '@/components/error/NotFound';
import DocsPage from '@/components/landing/DocsPage';
import LandingPage from '@/components/landing/LandingPage';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { ABACProvider } from '@/features/abac';
import { EnterpriseAuthProvider, EnterpriseProtectedRoute } from '@/features/auth';
import { EnterpriseLayout } from '@/features/enterprise';
import { DocumentSelectionProvider } from '@/features/documents/DocumentSelectionContext';
import { EnterpriseDashboard, DocumentsPage, AccessControlPage, ChatPage, EnterpriseLoginPage } from '@/pages/enterprise';
import Settings from '@/pages/Settings';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ErrorBoundary>
      <Routes>
        {/* Landing Page - Public (no redirect) */}
        <Route path="/" element={<LandingPage />} />

        {/* Documentation Page - Public */}
        <Route path="/docs" element={<DocsPage />} />

        {/* Neura App Routes */}
        <Route
          path="/neura"
          element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings Route */}
        <Route
          path="/neura/settings"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Settings />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        {/* Legacy settings redirect */}
        <Route
          path="/settings"
          element={<Navigate to="/neura/settings" replace />}
        />

        {/* Neura Auth Routes */}
        <Route
          path="/neura/login"
          element={
            isAuthenticated ? (
              <Navigate to="/neura" replace />
            ) : (
              <Layout showNavigation={false}>
                <Login />
              </Layout>
            )
          }
        />
        <Route
          path="/neura/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/neura" replace />
            ) : (
              <Layout showNavigation={false}>
                <SignUp />
              </Layout>
            )
          }
        />
        <Route
          path="/neura/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/neura" replace />
            ) : (
              <Layout showNavigation={false}>
                <ForgotPassword />
              </Layout>
            )
          }
        />
        <Route
          path="/neura/reset-password"
          element={
            isAuthenticated ? (
              <Navigate to="/neura" replace />
            ) : (
              <Layout showNavigation={false}>
                <ResetPassword />
              </Layout>
            )
          }
        />
        <Route
          path="/neura/verify-email"
          element={
            <Layout showNavigation={false}>
              <VerifyEmail />
            </Layout>
          }
        />

        {/* OAuth Callback Routes */}
        <Route
          path="/neura/auth/callback"
          element={
            <Layout showNavigation={false}>
              <OAuthCallback />
            </Layout>
          }
        />
        <Route
          path="/neura/auth/silent-callback"
          element={<SilentCallback />}
        />

        {/* Enterprise Routes - ABAC Knowledge System */}
        {/* Enterprise Login - Public */}
        <Route
          path="/enterprise/login"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseLoginPage />
            </EnterpriseAuthProvider>
          }
        />

        {/* Protected Enterprise Routes */}
        <Route
          path="/enterprise"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseProtectedRoute>
                <ABACProvider>
                  <EnterpriseLayout>
                    <EnterpriseDashboard />
                  </EnterpriseLayout>
                </ABACProvider>
              </EnterpriseProtectedRoute>
            </EnterpriseAuthProvider>
          }
        />
        <Route
          path="/enterprise/documents"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseProtectedRoute>
                <ABACProvider>
                  <EnterpriseLayout>
                    <DocumentsPage />
                  </EnterpriseLayout>
                </ABACProvider>
              </EnterpriseProtectedRoute>
            </EnterpriseAuthProvider>
          }
        />
        <Route
          path="/enterprise/access"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseProtectedRoute>
                <ABACProvider>
                  <EnterpriseLayout>
                    <AccessControlPage />
                  </EnterpriseLayout>
                </ABACProvider>
              </EnterpriseProtectedRoute>
            </EnterpriseAuthProvider>
          }
        />
        <Route
          path="/enterprise/chat"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseProtectedRoute>
                <ABACProvider>
                  <EnterpriseLayout>
                    <DocumentSelectionProvider>
                      <ChatPage />
                    </DocumentSelectionProvider>
                  </EnterpriseLayout>
                </ABACProvider>
              </EnterpriseProtectedRoute>
            </EnterpriseAuthProvider>
          }
        />
        <Route
          path="/enterprise/folders"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseProtectedRoute>
                <ABACProvider>
                  <EnterpriseLayout>
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Folders</h2>
                      <p className="text-sm text-gray-500">Organize documents into folders with inherited permissions</p>
                    </div>
                  </EnterpriseLayout>
                </ABACProvider>
              </EnterpriseProtectedRoute>
            </EnterpriseAuthProvider>
          }
        />
        <Route
          path="/enterprise/users"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseProtectedRoute>
                <ABACProvider>
                  <EnterpriseLayout>
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">User Management</h2>
                      <p className="text-sm text-gray-500">Manage users and their ABAC attributes</p>
                    </div>
                  </EnterpriseLayout>
                </ABACProvider>
              </EnterpriseProtectedRoute>
            </EnterpriseAuthProvider>
          }
        />
        <Route
          path="/enterprise/analytics"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseProtectedRoute>
                <ABACProvider>
                  <EnterpriseLayout>
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h2>
                      <p className="text-sm text-gray-500">Document access analytics and insights</p>
                    </div>
                  </EnterpriseLayout>
                </ABACProvider>
              </EnterpriseProtectedRoute>
            </EnterpriseAuthProvider>
          }
        />
        <Route
          path="/enterprise/settings"
          element={
            <EnterpriseAuthProvider>
              <EnterpriseProtectedRoute>
                <ABACProvider>
                  <EnterpriseLayout>
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Settings</h2>
                      <p className="text-sm text-gray-500">Configure ABAC policies and enterprise settings</p>
                    </div>
                  </EnterpriseLayout>
                </ABACProvider>
              </EnterpriseProtectedRoute>
            </EnterpriseAuthProvider>
          }
        />

        {/* Legacy route redirects */}
        <Route path="/app" element={<Navigate to="/neura" replace />} />
        <Route path="/dashboard" element={<Navigate to="/neura" replace />} />
        <Route path="/login" element={<Navigate to="/neura/login" replace />} />
        <Route
          path="/signup"
          element={<Navigate to="/neura/signup" replace />}
        />
        <Route
          path="/forgot-password"
          element={<Navigate to="/neura/forgot-password" replace />}
        />
        <Route
          path="/reset-password"
          element={<Navigate to="/neura/reset-password" replace />}
        />
        <Route
          path="/verify-email"
          element={<Navigate to="/neura/verify-email" replace />}
        />
        <Route
          path="/auth/callback"
          element={<Navigate to="/neura/auth/callback" replace />}
        />
        <Route
          path="/auth/silent-callback"
          element={<Navigate to="/neura/auth/silent-callback" replace />}
        />

        {/* 404 Not Found route */}
        <Route
          path="*"
          element={
            <Layout showNavigation={false}>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
