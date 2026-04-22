import {
  FileText,
  MessageSquare,
  Settings,
  Shield,
  BarChart3,
  Users,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import Logo from '@/components/Logo';
import { useABAC } from '@/features/abac';

interface EnterpriseSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    href: '/enterprise',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <FileText className="w-5 h-5" />,
    href: '/enterprise/documents',
  },
  {
    id: 'chat',
    label: 'AI Chat',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '/enterprise/chat',
  },
  {
    id: 'folders',
    label: 'Folders',
    icon: <FolderOpen className="w-5 h-5" />,
    href: '/enterprise/folders',
  },
];

const adminNavItems: NavItem[] = [
  {
    id: 'access',
    label: 'Access Control',
    icon: <Shield className="w-5 h-5" />,
    href: '/enterprise/access',
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="w-5 h-5" />,
    href: '/enterprise/users',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/enterprise/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/enterprise/settings',
  },
];

export function EnterpriseSidebar({
  isCollapsed,
  onToggle,
}: EnterpriseSidebarProps) {
  const location = useLocation();
  const { accessSummary, currentUser } = useABAC();

  const isActive = (href: string) => {
    if (href === '/enterprise') {
      return location.pathname === '/enterprise';
    }
    return location.pathname.startsWith(href);
  };

  const isAdmin =
    currentUser.attributes.role === 'admin' ||
    currentUser.attributes.role === 'director';

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Logo variant="icon" size="sm" />
            <span className="font-heading font-semibold text-gray-900">
              Enterprise
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto">
            <Logo variant="icon" size="sm" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors ${
            isCollapsed
              ? 'absolute -right-3 top-5 bg-white border border-gray-200 shadow-sm'
              : ''
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map(item => (
            <Link
              key={item.id}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive(item.href)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!isCollapsed && item.id === 'documents' && (
                <span className="ml-auto text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {accessSummary.accessible}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <>
            {!isCollapsed && (
              <div className="pt-6 pb-2">
                <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Administration
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="pt-4 border-t border-gray-100 mt-4" />
            )}
            <div className="space-y-1">
              {adminNavItems.map(item => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive(item.href)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Access Summary */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">
                Access Summary
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg font-semibold text-gray-900">
                  {accessSummary.accessible}
                </p>
                <p className="text-[10px] text-gray-500 uppercase">
                  Accessible
                </p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg font-semibold text-gray-400">
                  {accessSummary.denied}
                </p>
                <p className="text-[10px] text-gray-500 uppercase">
                  Restricted
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
