import { Plus, FileText, Trash2, RefreshCw } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useLocale } from '@/contexts/LocaleContext';
import userFileService from '@/services/userFileService';
import { useIntroTourStore } from '@/stores/introTourStore';
import { useUserStore } from '@/stores/userStore';
import { type Source } from '@/types';

import FileUploadModal from './FileUploadModal';

// File type icon component
const FileIcon: React.FC<{ fileType: string; className?: string }> = ({
  fileType,
  className = 'w-4 h-4',
}) => {
  const getFileIcon = () => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) {
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <text x="7" y="17" fontSize="6" fill="currentColor" fontWeight="bold">
            PDF
          </text>
        </svg>
      );
    } else if (type.includes('doc') || type.includes('word')) {
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <text x="6" y="17" fontSize="5" fill="currentColor" fontWeight="bold">
            DOC
          </text>
        </svg>
      );
    } else if (type.includes('txt') || type.includes('text')) {
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
        </svg>
      );
    }
    return <FileText className={className} />;
  };

  return <span className="text-gray-500">{getFileIcon()}</span>;
};

interface SourcesManagerProps {
  selectedSources: string[];
  onSourcesChange: (sources: string[]) => void;
  onSourcesLoad?: (sources: Source[]) => void;
  isToggleLeftMenu: boolean;
  showUploadModal: boolean;
  setShowUploadModal: (value: boolean) => void;
}

const SourcesManager: React.FC<SourcesManagerProps> = ({
  selectedSources,
  onSourcesChange,
  onSourcesLoad,
  showUploadModal,
  setShowUploadModal,
  isToggleLeftMenu,
}) => {
  const { t } = useLocale();
  const { isActive: isTourActive } = useIntroTourStore();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const { setFileIds, getFileIds } = useUserStore();

  useEffect(() => {
    loadSources();
  }, [isToggleLeftMenu]);

  // Listen for upload modal event from collapsed sidebar
  useEffect(() => {
    const handleOpenUploadModal = () => {
      setShowUploadModal(true);
    };
    window.addEventListener('openUploadModal', handleOpenUploadModal);
    return () => {
      window.removeEventListener('openUploadModal', handleOpenUploadModal);
    };
  }, []);

  const loadSources = async (isRefresh?: boolean) => {
    setLoading(true);
    try {
      const response = await userFileService.getUserFiles();
      const userFiles = response.data?.files || [];

      const sourcesData = userFiles.map((file: any) => ({
        id: file.fileId,
        name: file.originalName,
        subject: file.metadata?.subject || 'General',
        file_name: file.fileName,
        upload_date: file.uploadedAt,
        file_type: file.fileType,
        file_size: file.fileSize,
        type: 'file' as const,
        checked: false,
        s3Key: file.s3Key,
        s3Url: file.s3Url,
        metadata: file.metadata,
      }));

      if (isRefresh || !isToggleLeftMenu) {
        const selectedFileIds = sourcesData.map(source => source.id);
        setFileIds(selectedFileIds);
        onSourcesChange(selectedFileIds);
      }
      setSources(sourcesData);

      // Pass sources to parent component
      if (onSourcesLoad) {
        onSourcesLoad(sourcesData);
      }
    } catch (error) {
      console.error('Failed to load user files:', error);
      setSources([]);
      setFileIds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    const newSelected = selectedSources.includes(sourceId)
      ? selectedSources.filter(id => id !== sourceId)
      : [...selectedSources, sourceId];
    onSourcesChange(newSelected);
    // Update file IDs in zustand store
    setFileIds(newSelected);
  };

  const handleSelectAll = () => {
    const filteredSources = getFilteredSources();
    const allSelected = filteredSources.every(source =>
      selectedSources.includes(source.id)
    );

    if (allSelected) {
      // Deselect all filtered sources
      const newSelected = selectedSources.filter(
        id => !filteredSources.some(source => source.id === id)
      );
      onSourcesChange(newSelected);
      setFileIds(newSelected);
    } else {
      // Select all filtered sources
      const newSelected = [
        ...selectedSources,
        ...filteredSources
          .filter(source => !selectedSources.includes(source.id))
          .map(source => source.id),
      ];
      onSourcesChange(newSelected);
      setFileIds(newSelected);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    if (!source) return;

    try {
      await userFileService.removeFile(source.id);
      setFileIds(getFileIds().filter(fileId => fileId !== sourceId));

      setSources(prev => prev.filter(s => s.id !== sourceId));
      onSourcesChange(selectedSources.filter(id => id !== sourceId));
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Delete file error:', error);
      alert('Failed to delete file');
    }
  };

  const getFilteredSources = () => {
    return sources.filter(
      source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (source.subject &&
          source.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredSources = getFilteredSources();
  const allFilteredSelected =
    filteredSources.length > 0 &&
    filteredSources.every(source => selectedSources.includes(source.id));

  return (
    <div className="flex-1 p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            {t('files.source')}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadSources(true)}
              disabled={loading}
              className="p-1 hover:bg-gray-100 rounded"
              title="Refresh sources"
            >
              <RefreshCw
                className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            data-tour="upload-button"
            onClick={() => !isTourActive && setShowUploadModal(true)}
            disabled={isTourActive}
            className={`w-full flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('files.addButton')}
          </button>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-2" data-tour="file-list">
        {/* Select All */}
        <div className="flex items-center space-x-3 py-2">
          <input
            type="checkbox"
            checked={allFilteredSelected}
            onChange={handleSelectAll}
            disabled={isTourActive}
            className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
          />
          <span className="text-sm font-medium text-gray-700">
            {t('files.selectAll')} ({filteredSources.length})
          </span>
        </div>

        {/* Sources */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">
              Loading sources...
            </span>
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {searchTerm ? 'No sources found' : 'No sources available'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => !isTourActive && setShowUploadModal(true)}
                disabled={isTourActive}
                className={`mt-2 text-sm text-blue-600 hover:text-blue-700 ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                Upload your first files
              </button>
            )}
          </div>
        ) : (
          filteredSources.map(source => (
            <div
              key={source.id}
              className="flex items-center space-x-2 py-1.5 px-2 group hover:bg-gray-50 rounded-md"
            >
              <input
                type="checkbox"
                checked={selectedSources.includes(source.id)}
                onChange={() => handleSourceToggle(source.id)}
                disabled={isTourActive}
                className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0 ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
              />
              <FileIcon
                fileType={source.file_type || 'file'}
                className="w-4 h-4 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm text-gray-700 truncate block"
                  title={source.name}
                >
                  {source.name}
                </span>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => !isTourActive && setShowDeleteModal(source.id)}
                  disabled={isTourActive}
                  className={`p-1 hover:bg-red-100 rounded text-red-600 ${isTourActive ? 'cursor-not-allowed opacity-70' : ''}`}
                  title="Delete source"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          setShowUploadModal(false);
          loadSources(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          sourceName={sources.find(s => s.id === showDeleteModal)?.name || ''}
          onConfirm={() => handleDeleteSource(showDeleteModal)}
          onCancel={() => setShowDeleteModal(null)}
        />
      )}
    </div>
  );
};

// Confirm Delete Modal Component
const ConfirmDeleteModal: React.FC<{
  sourceName: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ sourceName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Delete Source</h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to delete &quot;<strong>{sourceName}</strong>
          &quot;? All associated documents will be permanently removed.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourcesManager;
