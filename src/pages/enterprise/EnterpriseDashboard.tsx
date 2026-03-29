import { FileText, Shield, TrendingUp, Clock, ChevronRight, Lock } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { useABAC } from '@/features/abac';
import {
  DEPARTMENT_LABELS,
  SENSITIVITY_CONFIG,
  type Department,
  type Sensitivity,
} from '@/features/abac/types';

export function EnterpriseDashboard() {
  const { currentUser, accessibleDocuments, accessSummary, allDocuments } = useABAC();

  // Get recent documents (last 5 accessible)
  const recentDocuments = accessibleDocuments
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Stats cards data
  const statsCards = [
    {
      label: 'Accessible Documents',
      value: accessSummary.accessible,
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Restricted Documents',
      value: accessSummary.denied,
      icon: <Lock className="w-5 h-5" />,
      color: 'bg-red-50 text-red-600',
    },
    {
      label: 'Your Clearance',
      value: currentUser.attributes.clearance,
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Department',
      value: DEPARTMENT_LABELS[currentUser.attributes.department],
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-gray-900">
          Welcome back, {currentUser.firstName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here is an overview of your document access and recent activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-semibold text-gray-900 capitalize">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Documents</h2>
            <Link
              to="/enterprise/documents"
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDocuments.map(doc => {
              const sensitivityConfig = SENSITIVITY_CONFIG[doc.attributes.sensitivity];
              return (
                <Link
                  key={doc.id}
                  to="/enterprise/documents"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                      <p className="text-xs text-gray-500">
                        {DEPARTMENT_LABELS[doc.attributes.department]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded ${sensitivityConfig.bgColor} ${sensitivityConfig.color}`}
                    >
                      {sensitivityConfig.label}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(doc.updatedAt)}</span>
                  </div>
                </Link>
              );
            })}
            {recentDocuments.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">No accessible documents found</p>
              </div>
            )}
          </div>
        </div>

        {/* Access Summary by Department */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Access by Department</h2>
          </div>
          <div className="p-5 space-y-4">
            {Object.entries(accessSummary.byDepartment).map(([dept, count]) => {
              const total = allDocuments.filter(d => d.attributes.department === dept).length;
              const percentage = Math.round((count / total) * 100) || 0;
              return (
                <div key={dept}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">
                      {DEPARTMENT_LABELS[dept as Department]}
                    </span>
                    <span className="text-gray-500">
                      {count}/{total}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(accessSummary.byDepartment).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No department data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Access Info Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Attribute-Based Access Control</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your access to documents is determined by your department ({DEPARTMENT_LABELS[currentUser.attributes.department]}),
              clearance level ({currentUser.attributes.clearance}), and region ({currentUser.attributes.region}).
              {currentUser.attributes.managedDepartments && currentUser.attributes.managedDepartments.length > 0 && (
                <> You also have manager access to: {currentUser.attributes.managedDepartments.map(d => DEPARTMENT_LABELS[d]).join(', ')}.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
