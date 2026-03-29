import { FileText, Filter, Grid, List, Search, X } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { useABAC } from '@/features/abac';
import { useDocumentSelection } from '../DocumentSelectionContext';
import {
  DEPARTMENT_LABELS,
  SENSITIVITY_CONFIG,
  type Department,
  type Sensitivity,
  type EnterpriseDocument,
} from '@/features/abac/types';

import { DocumentCard } from './DocumentCard';

interface DocumentsListProps {
  onDocumentView?: (doc: EnterpriseDocument) => void;
  showCheckboxes?: boolean;
}

export function DocumentsList({ onDocumentView, showCheckboxes = false }: DocumentsListProps) {
  const { allDocuments, checkAccess } = useABAC();
  const { selectionCount } = useDocumentSelection();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all');
  const [selectedSensitivity, setSelectedSensitivity] = useState<Sensitivity | 'all'>('all');
  const [showAccessible, setShowAccessible] = useState<'all' | 'accessible' | 'restricted'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.attributes.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Department filter
      if (selectedDepartment !== 'all' && doc.attributes.department !== selectedDepartment) {
        return false;
      }

      // Sensitivity filter
      if (selectedSensitivity !== 'all' && doc.attributes.sensitivity !== selectedSensitivity) {
        return false;
      }

      // Access filter
      if (showAccessible !== 'all') {
        const hasAccess = checkAccess(doc).allowed;
        if (showAccessible === 'accessible' && !hasAccess) return false;
        if (showAccessible === 'restricted' && hasAccess) return false;
      }

      return true;
    });
  }, [allDocuments, searchQuery, selectedDepartment, selectedSensitivity, showAccessible, checkAccess]);

  // Get unique departments and sensitivities
  const departments = Object.keys(DEPARTMENT_LABELS) as Department[];
  const sensitivities = Object.keys(SENSITIVITY_CONFIG) as Sensitivity[];

  const hasActiveFilters =
    searchQuery || selectedDepartment !== 'all' || selectedSensitivity !== 'all' || showAccessible !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedSensitivity('all');
    setShowAccessible('all');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value as Department | 'all')}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {DEPARTMENT_LABELS[dept]}
                </option>
              ))}
            </select>

            {/* Sensitivity Filter */}
            <select
              value={selectedSensitivity}
              onChange={e => setSelectedSensitivity(e.target.value as Sensitivity | 'all')}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="all">All Sensitivity</option>
              {sensitivities.map(sens => (
                <option key={sens} value={sens}>
                  {SENSITIVITY_CONFIG[sens].label}
                </option>
              ))}
            </select>

            {/* Access Filter */}
            <select
              value={showAccessible}
              onChange={e => setShowAccessible(e.target.value as 'all' | 'accessible' | 'restricted')}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="all">All Documents</option>
              <option value="accessible">Accessible Only</option>
              <option value="restricted">Restricted Only</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-1 ml-auto bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filteredDocuments.length}</span> of{' '}
          <span className="font-medium text-gray-900">{allDocuments.length}</span> documents
        </p>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'flex flex-col gap-3'
          }
        >
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={onDocumentView}
              showCheckbox={showCheckboxes}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No documents found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
