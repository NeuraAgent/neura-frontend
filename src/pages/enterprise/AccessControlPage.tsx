import {
  Shield,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';

import { useABAC } from '@/features/abac';
import { AccessTransparency, AccessLogs } from '@/features/abac/components';
import { DEPARTMENT_LABELS, SENSITIVITY_CONFIG } from '@/features/abac/types';

export function AccessControlPage() {
  const {
    currentUser,
    allDocuments,
    checkAccess,
    logAccess: _logAccess,
  } = useABAC();
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Get access decisions for all documents
  const accessDecisions = allDocuments.map(doc => ({
    document: doc,
    decision: checkAccess(doc),
  }));

  // Separate allowed and denied
  const allowedDocs = accessDecisions.filter(a => a.decision.allowed);
  const deniedDocs = accessDecisions.filter(a => !a.decision.allowed);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-gray-900">
          Access Control
        </h1>
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
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">
              Department
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {DEPARTMENT_LABELS[currentUser.attributes.department]}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">
              Role
            </p>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {currentUser.attributes.role}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">
              Clearance
            </p>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {currentUser.attributes.clearance}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">
              Region
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {currentUser.attributes.region}
            </p>
          </div>
        </div>
        {currentUser.attributes.managedDepartments &&
          currentUser.attributes.managedDepartments.length > 0 && (
            <div className="mt-4 bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-600 uppercase font-medium mb-1">
                Managed Departments
              </p>
              <p className="text-sm font-semibold text-blue-900">
                {currentUser.attributes.managedDepartments
                  .map(d => DEPARTMENT_LABELS[d])
                  .join(', ')}
              </p>
            </div>
          )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
          <p className="text-xs text-emerald-600 uppercase font-medium mb-1">
            Accessible
          </p>
          <p className="text-2xl font-bold text-emerald-700">
            {allowedDocs.length}
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            documents you can access
          </p>
        </div>
        <div className="bg-red-50 rounded-2xl border border-red-200 p-4">
          <p className="text-xs text-red-600 uppercase font-medium mb-1">
            Restricted
          </p>
          <p className="text-2xl font-bold text-red-700">{deniedDocs.length}</p>
          <p className="text-xs text-red-600 mt-1">
            documents you cannot access
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
          <p className="text-xs text-blue-600 uppercase font-medium mb-1">
            Total Documents
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {allDocuments.length}
          </p>
          <p className="text-xs text-blue-600 mt-1">in the system</p>
        </div>
      </div>

      {/* Access Decisions with Transparency */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Document Access Decisions
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time ABAC evaluation with transparent reasoning for each
            decision
          </p>
        </div>

        {/* Allowed Documents */}
        {allowedDocs.length > 0 && (
          <div className="border-b border-gray-50">
            <div className="px-5 py-3 bg-emerald-50">
              <h3 className="text-xs font-semibold text-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Accessible ({allowedDocs.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {allowedDocs.map(({ document, decision }) => {
                const sensitivityConfig =
                  SENSITIVITY_CONFIG[document.attributes.sensitivity];
                const isExpanded = expandedDocId === document.id;

                return (
                  <div key={document.id} className="p-4">
                    <div
                      onClick={() =>
                        setExpandedDocId(isExpanded ? null : document.id)
                      }
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {document.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
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
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 ml-12 pt-3 border-t border-gray-100">
                        <AccessTransparency
                          decision={decision}
                          documentTitle={document.title}
                          showFullDetails={true}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Restricted Documents */}
        {deniedDocs.length > 0 && (
          <div>
            <div className="px-5 py-3 bg-red-50">
              <h3 className="text-xs font-semibold text-red-900 flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5" />
                Restricted ({deniedDocs.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {deniedDocs.map(({ document, decision }) => {
                const sensitivityConfig =
                  SENSITIVITY_CONFIG[document.attributes.sensitivity];
                const isExpanded = expandedDocId === document.id;

                return (
                  <div key={document.id} className="p-4">
                    <div
                      onClick={() =>
                        setExpandedDocId(isExpanded ? null : document.id)
                      }
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-red-50 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {document.title}
                          </p>
                          <p className="text-xs text-red-600 mt-0.5">
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
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 ml-12 pt-3 border-t border-gray-100">
                        <AccessTransparency
                          decision={decision}
                          documentTitle={document.title}
                          showFullDetails={true}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Access Audit Logs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4" />
          Access Audit Logs
        </h2>
        <AccessLogs />
      </div>
    </div>
  );
}
