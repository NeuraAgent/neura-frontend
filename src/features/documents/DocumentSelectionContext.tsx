import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

interface DocumentSelectionContextValue {
  // Selected document IDs
  selectedDocumentIds: string[];
  
  // Add/remove document selection
  toggleDocument: (documentId: string) => void;
  addDocument: (documentId: string) => void;
  removeDocument: (documentId: string) => void;
  
  // Clear selection
  clearSelection: () => void;
  
  // Check if document is selected
  isSelected: (documentId: string) => boolean;
  
  // Count of selected documents
  selectionCount: number;
}

const DocumentSelectionContext = createContext<DocumentSelectionContextValue | null>(null);

export function DocumentSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>(() => {
    // Initialize from localStorage if available
    try {
      const stored = localStorage.getItem('selectedDocumentIds');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever selection changes
  const updateSelection = useCallback((ids: string[]) => {
    setSelectedDocumentIds(ids);
    try {
      localStorage.setItem('selectedDocumentIds', JSON.stringify(ids));
    } catch {
      // localStorage not available, silently fail
    }
  }, []);

  const toggleDocument = useCallback((documentId: string) => {
    setSelectedDocumentIds(prev => {
      const newIds = prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId];
      updateSelection(newIds);
      return newIds;
    });
  }, [updateSelection]);

  const addDocument = useCallback((documentId: string) => {
    setSelectedDocumentIds(prev => {
      if (prev.includes(documentId)) return prev;
      const newIds = [...prev, documentId];
      updateSelection(newIds);
      return newIds;
    });
  }, [updateSelection]);

  const removeDocument = useCallback((documentId: string) => {
    setSelectedDocumentIds(prev => {
      const newIds = prev.filter(id => id !== documentId);
      updateSelection(newIds);
      return newIds;
    });
  }, [updateSelection]);

  const clearSelection = useCallback(() => {
    updateSelection([]);
    setSelectedDocumentIds([]);
  }, [updateSelection]);

  const isSelected = useCallback(
    (documentId: string) => selectedDocumentIds.includes(documentId),
    [selectedDocumentIds]
  );

  const selectionCount = selectedDocumentIds.length;

  const value = useMemo(
    () => ({
      selectedDocumentIds,
      toggleDocument,
      addDocument,
      removeDocument,
      clearSelection,
      isSelected,
      selectionCount,
    }),
    [selectedDocumentIds, toggleDocument, addDocument, removeDocument, clearSelection, isSelected]
  );

  return (
    <DocumentSelectionContext.Provider value={value}>
      {children}
    </DocumentSelectionContext.Provider>
  );
}

export function useDocumentSelection() {
  const context = useContext(DocumentSelectionContext);
  if (!context) {
    throw new Error('useDocumentSelection must be used within a DocumentSelectionProvider');
  }
  return context;
}
