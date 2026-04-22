import { X, FileText } from 'lucide-react';
import React from 'react';

import { useABAC } from '@/features/abac/ABACContext';
import { SENSITIVITY_CONFIG } from '@/features/abac/types';

import { useDocumentSelection } from './DocumentSelectionContext';

export function SelectedDocumentsPanel() {
  const {
    selectedDocumentIds,
    removeDocument,
    clearSelection,
    selectionCount,
  } = useDocumentSelection();
  const { accessibleDocuments } = useABAC();

  const selectedDocs = accessibleDocuments.filter(doc =>
    selectedDocumentIds.includes(doc.id)
  );

  if (selectionCount === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs text-gray-600 text-center">
          No documents selected yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Active Knowledge Base ({selectionCount})
        </h3>
        {selectionCount > 0 && (
          <button
            onClick={clearSelection}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Selected Documents */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {selectedDocs.map(doc => {
          const sensitivityConfig =
            SENSITIVITY_CONFIG[doc.attributes.sensitivity];

          return (
            <div
              key={doc.id}
              className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-2.5 hover:border-gray-300 group"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate group-hover:text-blue-600">
                  {doc.title}
                </p>
                <span
                  className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium ${sensitivityConfig.bgColor} ${sensitivityConfig.color}`}
                >
                  {sensitivityConfig.label}
                </span>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeDocument(doc.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="rounded-lg bg-blue-50 p-2.5 text-xs text-blue-900">
        <p className="font-medium">Ready for AI chat</p>
        <p className="text-blue-700">
          {selectionCount} document{selectionCount !== 1 ? 's' : ''} will be
          used as context
        </p>
      </div>
    </div>
  );
}
