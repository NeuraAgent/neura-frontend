import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  User,
  Shield,
  BarChart3,
  FileText,
  Settings,
  Users,
  Database,
} from 'lucide-react';

import { useEnterpriseAuth } from '../EnterpriseAuthContext';
import { useABAC } from '../ABACContext';

/**
 * Enterprise Dashboard - Protected page showing user info and ABAC permissions
 */
const EnterpriseDashboard: React.FC = () => {
  const { user, logout } = useEnterpriseAuth();
  const { can, accessibleResources, isAdmin, isManager, hasPermission } = useABAC();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/enterprise/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Enterprise Portal</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-2xl font-semibold mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-300">
            You are logged in as {user.role} in the {user.department} department.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-semibold text-gray-900">User Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Full Name
                </p>
                <p className="text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Department
                </p>
                <p className="text-gray-900">{user.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Role
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Permissions Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Your Permissions</h2>
            </div>

            <div className="space-y-3">
              {user.permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-700">{permission}</span>
                </div>
              ))}
            </div>

            {/* Role Badges */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
              {isAdmin && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
                  Administrator
                </span>
              )}
              {isManager && !isAdmin && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-700">
                  Manager
                </span>
              )}
            </div>
          </div>

          {/* ABAC Access Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Resource Access</h2>
            </div>

            <div className="space-y-3">
              {accessibleResources.map((resource) => (
                <div
                  key={resource}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm text-gray-700 capitalize">{resource}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions based on ABAC */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {can('dashboard', 'read') && (
              <ActionCard icon={BarChart3} label="Dashboard" available />
            )}
            {can('analytics', 'read') && (
              <ActionCard icon={BarChart3} label="Analytics" available />
            )}
            {can('reports', 'read') && (
              <ActionCard icon={FileText} label="Reports" available />
            )}
            {can('users', 'admin') && (
              <ActionCard icon={Users} label="Users" available />
            )}
            {can('settings', 'admin') && (
              <ActionCard icon={Settings} label="Settings" available />
            )}
            {can('data', 'read') && (
              <ActionCard icon={Database} label="Data" available />
            )}
          </div>
        </div>

        {/* Permission Checker */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            ABAC Permission Checker
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <PermissionBadge
              label="Read Analytics"
              allowed={can('analytics', 'read')}
            />
            <PermissionBadge
              label="Export Data"
              allowed={hasPermission('export_data')}
            />
            <PermissionBadge
              label="Manage Users"
              allowed={can('users', 'admin')}
            />
            <PermissionBadge
              label="Admin Settings"
              allowed={can('settings', 'admin')}
            />
            <PermissionBadge
              label="Write Data"
              allowed={can('data', 'write')}
            />
            <PermissionBadge
              label="Delete Data"
              allowed={can('data', 'delete')}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const ActionCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  available: boolean;
}> = ({ icon: Icon, label, available }) => (
  <button
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
      available
        ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer'
        : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-50'
    }`}
    disabled={!available}
  >
    <Icon className="w-6 h-6 text-gray-600" />
    <span className="text-sm text-gray-700">{label}</span>
  </button>
);

const PermissionBadge: React.FC<{ label: string; allowed: boolean }> = ({
  label,
  allowed,
}) => (
  <div
    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      allowed
        ? 'bg-green-50 text-green-700'
        : 'bg-red-50 text-red-700'
    }`}
  >
    <div
      className={`w-2 h-2 rounded-full ${
        allowed ? 'bg-green-500' : 'bg-red-500'
      }`}
    />
    {label}
  </div>
);

export default EnterpriseDashboard;
