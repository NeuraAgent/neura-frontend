import { Shield, Clock, FileText, User, CheckCircle, XCircle } from 'lucide-react';
import React from 'react';

import { useABAC } from '@/features/abac';
import { DEPARTMENT_LABELS, SENSITIVITY_CONFIG } from '@/features/abac/types';

export function AccessControlPage() {
  const { currentUser, accessLogs, allDocuments, checkAccess } = useABAC();

  // Get access decisions for all documents
  const accessDecisions = allDocuments.map(doc => ({
    document: doc,
    decision: checkAccess(doc),
  }));

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-gray-900">Access Control</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your ABAC policies and access audit logs
        </p>
      </div>

      {/* User Attributes Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4" />
          Your Access Attributes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Department</p>
            <p className="text-sm font-semibold text-gray-900">
              {DEPARTMENT_LABELS[currentUser.attributes.department]}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Role</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {currentUser.attributes.role}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Clearance</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {currentUser.attributes.clearance}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Region</p>
            <p className="text-sm font-semibold text-gray-900">
              {currentUser.attributes.region}
            </p>
          </div>
        </div>
        {currentUser.attributes.managedDepartments && currentUser.attributes.managedDepartments.length > 0 && (
          <div className="mt-4 bg-blue-50 rounded-xl p-4">
            <p className="text-xs text-blue-600 uppercase font-medium mb-1">Managed Departments</p>
            <p className="text-sm font-semibold text-blue-900">
              {currentUser.attributes.managedDepartments.map(d => DEPARTMENT_LABELS[d]).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Access Decisions */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Document Access Decisions
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time ABAC evaluation for all documents
          </p>
        </div>
        <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
          {accessDecisions.map(({ document, decision }) => {
            const sensitivityConfig = SENSITIVITY_CONFIG[document.attributes.sensitivity];
            return (
              <div key={document.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {decision.allowed ? (
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-red-50 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{document.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 max-w-md truncate">
                      {decision.reason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium rounded ${sensitivityConfig.bgColor} ${sensitivityConfig.color}`}
                  >
                    {sensitivityConfig.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {DEPARTMENT_LABELS[document.attributes.department]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Access Logs */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Access Logs
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Audit trail of document access attempts
          </p>
        </div>
        {accessLogs.length > 0 ? (
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {accessLogs.map(log => {
              const document = allDocuments.find(d => d.id === log.documentId);
              return (
                <div key={log.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {log.decision.allowed ? (
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="p-2 bg-red-50 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {document?.title || log.documentId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Action: <span className="capitalize">{log.action}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{formatTime(log.timestamp)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No access logs yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Access logs will appear here when you view or download documents
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
