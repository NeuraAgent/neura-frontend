import { FileText, Download, Lock, Eye, Calendar, User, Tag, Globe } from 'lucide-react';
import React from 'react';

import { useABAC } from '@/features/abac';
import { useDocumentSelection } from '../DocumentSelectionContext';
import {
  SENSITIVITY_CONFIG,
  DEPARTMENT_LABELS,
  REGION_LABELS,
  type EnterpriseDocument,
} from '@/features/abac/types';

interface DocumentCardProps {
  document: EnterpriseDocument;
  onView?: (doc: EnterpriseDocument) => void;
  onDownload?: (doc: EnterpriseDocument) => void;
  showCheckbox?: boolean;
}

export function DocumentCard({ document, onView, onDownload, showCheckbox = false }: DocumentCardProps) {
  const { checkAccess, logAccess } = useABAC();
  const { isSelected, toggleDocument } = useDocumentSelection();
  const accessDecision = checkAccess(document);
  const isDocSelected = isSelected(document.id);

  const sensitivityConfig = SENSITIVITY_CONFIG[document.attributes.sensitivity];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFileIcon = (fileType: string) => {
    return <FileText className="w-5 h-5" />;
  };

  const handleView = () => {
    if (accessDecision.allowed) {
      logAccess(document.id, 'view', accessDecision);
      onView?.(document);
    }
  };

  const handleDownload = () => {
    if (accessDecision.allowed) {
      logAccess(document.id, 'download', accessDecision);
      onDownload?.(document);
    }
  };

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 ${
        accessDecision.allowed
          ? 'border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50'
          : 'border-gray-100 opacity-60'
      }`}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3 gap-2">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isDocSelected}
              onChange={() => toggleDocument(document.id)}
              disabled={!accessDecision.allowed}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
          <div
            className={`p-2 rounded-xl flex-shrink-0 ${
              accessDecision.allowed ? 'bg-gray-100' : 'bg-gray-50'
            }`}
          >
            {getFileIcon(document.fileType)}
          </div>

          {/* Sensitivity Badge */}
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md ${sensitivityConfig.bgColor} ${sensitivityConfig.color}`}
          >
            {sensitivityConfig.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
          {document.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {document.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-[10px] text-gray-400">
          <span className="inline-flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
            <Tag className="w-3 h-3" />
            {DEPARTMENT_LABELS[document.attributes.department]}
          </span>
          <span className="inline-flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
            <Globe className="w-3 h-3" />
            {REGION_LABELS[document.attributes.region]}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(document.updatedAt)}
          </span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {accessDecision.allowed ? (
            <>
              <button
                onClick={handleView}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="View document"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download document"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 text-gray-400" title={accessDecision.reason}>
              <Lock className="w-4 h-4" />
              <span className="text-[10px]">Restricted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
