import {
  FileText,
  LogOut,
  PanelLeft,
  PanelRight,
  Settings,
  Trash2,
  User,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import SourcesManager from '@/components/SourcesManager';
import { useLocale } from '@/contexts/LocaleContext';

interface DashboardSidebarProps {
  isOpen: boolean;
  isToggleLeftMenu: boolean;
  isTourActive: boolean;
  sources: any[];
  selectedSources: string[];
  showUploadModal: boolean;
  messageCount: number;
  onToggle: () => void;
  onLogout: () => void;
  onClearConversation: () => void;
  onSourcesChange: (sources: string[]) => void;
  onSourcesLoad: (sources: any[]) => void;
  setShowUploadModal: (show: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  isToggleLeftMenu,
  isTourActive,
  sources,
  selectedSources,
  showUploadModal,
  messageCount,
  onToggle,
  onLogout,
  onClearConversation,
  onSourcesChange,
  onSourcesLoad,
  setShowUploadModal,
}) => {
  const { t } = useLocale();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container')) {
          setShowUserMenu(false);
        }
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showUserMenu) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showUserMenu]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-20 p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm lg:hidden cursor-pointer"
        >
          <PanelRight className="w-5 h-5 text-gray-600" />
        </button>
      )}

      <div
        className={`fixed top-0 bottom-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden z-30
          ${isOpen ? 'left-0 w-70 sm:w-80' : '-left-full lg:left-0 lg:w-16'}
          lg:left-4 lg:top-4 lg:bottom-4 lg:rounded-md lg:border`}
      >
        {isOpen ? (
          <>
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <Logo variant="icon" size="md" />
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="relative user-menu-container">
                    <button
                      data-tour="settings-button"
                      onClick={() =>
                        !isTourActive && setShowUserMenu(!showUserMenu)
                      }
                      disabled={isTourActive}
                      className={`w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center ${isTourActive ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                    >
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                        <div className="px-3 sm:px-4 py-2 border-b border-gray-100">
                          <div className="text-xs text-gray-500 mb-2">
                            {t('nav.language')}
                          </div>
                          <LanguageSwitcher />
                        </div>
                        <Link
                          to="/neura/settings"
                          className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                          {t('nav.settings')}
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={onLogout}
                          className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                          {t('nav.signout')}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      className={`flex items-center text-gray-600 p-1 ${isTourActive ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                      onClick={() => !isTourActive && onToggle()}
                      disabled={isTourActive}
                      title="Collapse sidebar"
                    >
                      <PanelLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <SourcesManager
              isToggleLeftMenu={isToggleLeftMenu}
              selectedSources={selectedSources}
              showUploadModal={showUploadModal}
              setShowUploadModal={setShowUploadModal}
              onSourcesChange={onSourcesChange}
              onSourcesLoad={onSourcesLoad}
            />

            <div className="flex justify-center px-3">
              <button
                onClick={() => !isTourActive && onClearConversation()}
                disabled={isTourActive}
                className={`text-xs sm:text-sm text-gray-500 hover:text-gray-700 px-4 sm:px-8 py-2.5 sm:py-[12px] rounded mb-4 sm:mb-[30px] bg-[#F8F7F6] transition-colors w-full sm:w-auto ${isTourActive ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {t('dashboard.clearConversation')} ({messageCount})
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-4 space-y-4 h-full">
            <Logo variant="icon" size="md" />

            <button
              onClick={() => !isTourActive && onToggle()}
              disabled={isTourActive}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${isTourActive ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              title="Expand sidebar"
            >
              <PanelRight className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 overflow-y-auto space-y-2 w-full flex flex-col items-center">
              {sources.slice(0, 5).map(source => (
                <div
                  key={source.id}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title={source.name}
                >
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
              ))}
            </div>

            <button
              onClick={() => !isTourActive && onClearConversation()}
              disabled={isTourActive}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors mt-auto ${isTourActive ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              title="Clear conversation"
            >
              <Trash2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
