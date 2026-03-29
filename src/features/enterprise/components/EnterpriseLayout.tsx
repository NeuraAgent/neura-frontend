import React, { useState, type ReactNode } from 'react';

import { EnterpriseHeader } from './EnterpriseHeader';
import { EnterpriseSidebar } from './EnterpriseSidebar';

interface EnterpriseLayoutProps {
  children: ReactNode;
}

export function EnterpriseLayout({ children }: EnterpriseLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <EnterpriseSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Header */}
        <EnterpriseHeader />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
