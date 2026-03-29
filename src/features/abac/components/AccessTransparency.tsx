import React from 'react';
import type { AccessDecision } from '../types';

interface AccessTransparencyProps {
  decision: AccessDecision;
  documentTitle?: string;
  showFullDetails?: boolean;
}

export function AccessTransparency({
  decision,
  documentTitle = 'Document',
  showFullDetails = false,
}: AccessTransparencyProps) {
  const { allowed, reason, reasons = [reason] } = decision;

  return (
    <div className="flex flex-col gap-2">
      {/* Access Badge */}
      <div className="flex items-center gap-2">
        {allowed ? (
          <>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
              <span className="text-sm font-semibold text-emerald-700">✓</span>
            </div>
            <span className="text-sm font-semibold text-emerald-700">Access Allowed</span>
          </>
        ) : (
          <>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50">
              <span className="text-sm font-semibold text-red-700">✕</span>
            </div>
            <span className="text-sm font-semibold text-red-700">Access Denied</span>
          </>
        )}
      </div>

      {/* Primary Reason */}
      <p className={`text-sm ${allowed ? 'text-emerald-600' : 'text-red-600'}`}>
        {reason}
      </p>

      {/* Detailed Reasons (if multiple) */}
      {showFullDetails && reasons.length > 1 && (
        <details className="mt-2 text-xs text-gray-600">
          <summary className="cursor-pointer font-medium hover:text-gray-900">
            Details ({reasons.length} rule{reasons.length !== 1 ? 's' : ''})
          </summary>
          <ul className="mt-2 list-inside list-disc space-y-1 rounded-lg bg-gray-50 p-3">
            {reasons.map((r, idx) => (
              <li key={idx} className="text-gray-700">
                {r}
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Evaluated Timestamp */}
      <p className="text-xs text-gray-500">
        Evaluated: {new Date(decision.evaluatedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}
