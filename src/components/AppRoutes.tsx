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
