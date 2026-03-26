import { useEffect } from 'react';

export const useModalEffects = (
  isOpen: boolean,
  isUploading: boolean,
  isTourActive: boolean,
  onClose: () => void
) => {
  // Close modal if tour becomes active
  useEffect(() => {
    if (isTourActive && isOpen && !isUploading) {
      onClose();
    }
  }, [isTourActive, isOpen, isUploading, onClose]);

  // Dispatch modal state events
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('uploadModalOpen'));
    } else {
      window.dispatchEvent(new Event('uploadModalClose'));
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isUploading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, isUploading, onClose]);
};
