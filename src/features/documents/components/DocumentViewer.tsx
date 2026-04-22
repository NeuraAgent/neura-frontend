import {
  X,
  Download,
  Clock,
  FileText,
  Shield,
  Globe,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import React from 'react';

import { useABAC } from '@/features/abac';
import {
  SENSITIVITY_CONFIG,
  DEPARTMENT_LABELS,
  REGION_LABELS,
  type EnterpriseDocument,
} from '@/features/abac/types';

interface DocumentViewerProps {
  document: EnterpriseDocument | null;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const { checkAccess, logAccess } = useABAC();

  if (!document) return null;

  const accessDecision = checkAccess(document);
  const sensitivityConfig = SENSITIVITY_CONFIG[document.attributes.sensitivity];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    if (accessDecision.allowed) {
      logAccess(document.id, 'download', accessDecision);
      // In a real app, this would trigger the actual download
      console.log('Downloading document:', document.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {document.title}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md ${sensitivityConfig.bgColor} ${sensitivityConfig.color}`}
                >
                  <Shield className="w-3 h-3" />
                  {sensitivityConfig.label}
                </span>
                <span className="text-xs text-gray-500">
                  Version {document.version}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Access Decision Banner */}
          {!accessDecision.allowed && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">
                    Access Denied
                  </h4>
                  <p className="text-sm text-red-600">
                    {accessDecision.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {document.description}
            </p>
          </div>

          {/* Document Content Preview */}
          {accessDecision.allowed && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Content Preview
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {document.content}
                </p>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">
                  Department
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {DEPARTMENT_LABELS[document.attributes.department]}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">Region</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {REGION_LABELS[document.attributes.region]}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">
                  Last Updated
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(document.updatedAt)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">File Info</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {document.fileType.toUpperCase()} -{' '}
                {formatFileSize(document.fileSize)}
              </p>
            </div>
          </div>

          {/* Tags */}
          {document.attributes.tags && document.attributes.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {document.attributes.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500">
            Created {formatDate(document.createdAt)}
          </div>
          {accessDecision.allowed && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
