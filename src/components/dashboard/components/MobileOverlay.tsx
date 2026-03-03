import React from 'react';

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileOverlay: React.FC<MobileOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 z-20 lg:hidden"
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape') onClose();
      }}
      role="button"
      tabIndex={0}
      aria-label="Close sidebar"
    />
  );
};
