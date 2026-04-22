import React, { useState } from 'react';

import { SENSITIVITY_CONFIG } from '@/features/abac/types';

import type { Citation } from '../types';

interface CitationListProps {
  citations: Citation[];
}

export function CitationList({ citations }: CitationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
        Sources
      </p>
      <div className="space-y-2">
        {citations.map(citation => {
          const sensitivityConfig = SENSITIVITY_CONFIG[citation.sensitivity];
          const isExpanded = expandedId === citation.documentId;

          return (
            <div
              key={citation.documentId}
              className="rounded-lg border border-gray-200 bg-white p-2.5 text-xs hover:border-gray-300"
            >
              {/* Citation Header */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : citation.documentId)
                }
                className="w-full text-left"
              >
                <div className="flex items-start gap-2">
                  {/* Icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    <span className="text-gray-400">📄</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {citation.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${sensitivityConfig.bgColor} ${sensitivityConfig.color}`}
                      >
                        {sensitivityConfig.label}
                      </span>
                      <span className="text-gray-500">
                        {citation.department}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Icon */}
                  <div className="flex-shrink-0 text-gray-400">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>
              </button>

              {/* Citation Preview */}
              {isExpanded && (
                <div className="mt-2 border-t border-gray-200 pt-2 text-xs leading-relaxed text-gray-700">
                  <p className="line-clamp-3">
                    &ldquo;{citation.preview}&rdquo;
                  </p>
                  <p className="mt-1 text-gray-500">
                    — Page {citation.pageNumber || 1}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
