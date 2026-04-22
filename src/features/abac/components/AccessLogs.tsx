import React, { useMemo, useState } from 'react';

import { useABAC } from '../ABACContext';

export function AccessLogs() {
  const { accessLogs } = useABAC();
  const [filter, setFilter] = useState<'all' | 'allowed' | 'denied'>('all');

  const filteredLogs = useMemo(() => {
    return accessLogs.filter(log => {
      if (filter === 'allowed') return log.decision.allowed;
      if (filter === 'denied') return !log.decision.allowed;
      return true;
    });
  }, [accessLogs, filter]);

  if (filteredLogs.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-600">No access logs yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'allowed', 'denied'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? f === 'allowed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : f === 'denied'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray-100 text-gray-900'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all' && 'All'}
            {f === 'allowed' &&
              `Allowed (${accessLogs.filter(l => l.decision.allowed).length})`}
            {f === 'denied' &&
              `Denied (${accessLogs.filter(l => !l.decision.allowed).length})`}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Time
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Action
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Document ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Decision
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Reason
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr
                key={log.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-gray-600">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {log.documentId}
                </td>
                <td className="px-4 py-3">
                  {log.decision.allowed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <span>✓</span> Allowed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      <span>✕</span> Denied
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <details className="group">
                    <summary className="cursor-pointer hover:underline">
                      Show reason
                    </summary>
                    <p className="mt-2 rounded bg-gray-100 p-2 text-xs">
                      {log.decision.reason}
                    </p>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Summary */}
      <div className="grid grid-cols-3 gap-4 rounded-xl border border-gray-200 p-4">
        <div>
          <p className="text-xs text-gray-600">Total Logs</p>
          <p className="text-lg font-semibold text-gray-900">
            {filteredLogs.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Allowed</p>
          <p className="text-lg font-semibold text-emerald-700">
            {filteredLogs.filter(l => l.decision.allowed).length}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Denied</p>
          <p className="text-lg font-semibold text-red-700">
            {filteredLogs.filter(l => !l.decision.allowed).length}
          </p>
        </div>
      </div>
    </div>
  );
}
