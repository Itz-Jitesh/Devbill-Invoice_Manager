'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from '@/components/ui/CommandPalette';
import NotificationPanel from './NotificationPanel';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] font-body flex">
      <CommandPalette />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300 w-full overflow-hidden">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onNotificationsClick={() => setIsNotificationsOpen(true)}
        />
        <div className="flex-1 px-6 lg:px-8 py-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
