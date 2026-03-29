import React, { useState } from 'react';

import { DocumentsList, DocumentViewer } from '@/features/documents';
import type { EnterpriseDocument } from '@/features/abac/types';

export function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<EnterpriseDocument | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-gray-900">Documents</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse and manage your accessible documents with ABAC-powered access control
        </p>
      </div>

      {/* Documents List */}
      <DocumentsList onDocumentView={setSelectedDocument} />

      {/* Document Viewer Modal */}
      <DocumentViewer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
}
