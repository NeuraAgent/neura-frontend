import React, { useState } from 'react';

import type { EnterpriseDocument } from '@/features/abac/types';
import { DocumentsList, DocumentViewer } from '@/features/documents';
import { DocumentSelectionProvider } from '@/features/documents/DocumentSelectionContext';

export function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] =
    useState<EnterpriseDocument | null>(null);

  return (
    <DocumentSelectionProvider>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-heading font-semibold text-gray-900">
            Documents
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse and manage your accessible documents. Select documents to use
            them in AI chat.
          </p>
        </div>

        {/* Documents List with Checkboxes */}
        <DocumentsList
          onDocumentView={setSelectedDocument}
          showCheckboxes={true}
        />

        {/* Document Viewer Modal */}
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      </div>
    </DocumentSelectionProvider>
  );
}
