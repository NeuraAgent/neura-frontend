import React, { useState } from 'react';

import { SENSITIVITY_CONFIG } from '@/features/abac/types';

import { useABAC } from '../../abac/ABACContext';
import { useDocumentSelection } from '../../documents/DocumentSelectionContext';

interface DocumentSelectorProps {
  selectedCount: number;
}

export function DocumentSelector({ selectedCount }: DocumentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { accessibleDocuments } = useABAC();
  const { selectedDocumentIds, toggleDocument, clearSelection } =
    useDocumentSelection();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Active Knowledge Base
        </h3>
        {selectedCount > 0 && (
          <button
            onClick={clearSelection}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Documents Badge */}
      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
          <span className="text-xs font-semibold text-blue-700">
            {selectedCount}
          </span>
        </div>
        <span className="text-sm font-medium text-blue-900">
          {selectedCount === 0
            ? 'No documents selected'
            : selectedCount === 1
              ? '1 document selected'
              : `${selectedCount} documents selected`}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto text-gray-600 hover:text-gray-900"
        >
          {isOpen ? '▼' : '▶'}
        </button>
      </div>

      {/* Document List (Expandable) */}
      {isOpen && (
        <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 max-h-64 overflow-y-auto">
          {accessibleDocuments.length === 0 ? (
            <p className="text-xs text-gray-600">No documents available</p>
          ) : (
            accessibleDocuments.map(doc => {
              const isSelected = selectedDocumentIds.includes(doc.id);
              const sensitivityConfig =
                SENSITIVITY_CONFIG[doc.attributes.sensitivity];

              return (
                <label
                  key={doc.id}
                  className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-2.5 hover:bg-gray-50 cursor-pointer"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDocument(doc.id)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />

                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {doc.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${sensitivityConfig.bgColor} ${sensitivityConfig.color}`}
                      >
                        {sensitivityConfig.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {doc.attributes.department}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>
      )}

      {/* Quick Stats */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-xs">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{selectedCount}</span>{' '}
            document
            {selectedCount !== 1 ? 's' : ''} will be used as context for your
            questions
          </span>
        </div>
      )}
    </div>
  );
}
