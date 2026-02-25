import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
