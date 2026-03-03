/**
 * useSidebar Hook
 * Manages sidebar state and toggle logic
 */

import { useState } from 'react';

export const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isToggleLeftMenu, setIsToggleLeftMenu] = useState(false);

  const toggleSidebar = () => {
    if (!isToggleLeftMenu) {
      setIsToggleLeftMenu(true);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  return {
    isSidebarOpen,
    isToggleLeftMenu,
    toggleSidebar,
  };
};
