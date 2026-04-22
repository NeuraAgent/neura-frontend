import { Bell, ChevronDown, Search, Shield } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { useABAC } from '@/features/abac';
import { DEPARTMENT_LABELS, type EnterpriseUser } from '@/features/abac/types';

interface EnterpriseHeaderProps {
  onSearch?: (query: string) => void;
}

export function EnterpriseHeader({ onSearch }: EnterpriseHeaderProps) {
  const { currentUser, setCurrentUser, availableUsers } = useABAC();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleUserSwitch = (user: EnterpriseUser) => {
    setCurrentUser(user);
    setShowUserMenu(false);
  };

  const getClearanceColor = (clearance: string) => {
    switch (clearance) {
      case 'restricted':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'confidential':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'internal':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
          />
        </div>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white text-sm font-medium">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>

            {/* User Info */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {DEPARTMENT_LABELS[currentUser.attributes.department]}
              </p>
            </div>

            {/* Department Badge */}
            <span
              className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border ${getClearanceColor(currentUser.attributes.clearance)}`}
            >
              <Shield className="w-3 h-3" />
              {currentUser.attributes.clearance}
            </span>

            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Switch User (Demo)
                </p>
              </div>
              <div className="py-1 max-h-64 overflow-y-auto">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSwitch(user)}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      currentUser.id === user.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {DEPARTMENT_LABELS[user.attributes.department]}
                        </span>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded border ${getClearanceColor(user.attributes.clearance)}`}
                        >
                          {user.attributes.clearance}
                        </span>
                      </div>
                    </div>
                    {currentUser.id === user.id && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
