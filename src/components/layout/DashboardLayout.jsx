'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from '@/components/ui/CommandPalette';

/**
 * DashboardLayout component
 * @description Provides the standard layout for authenticated dashboard pages.
 */
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body overflow-x-hidden">
      {/* Search and Command Palette */}
      <CommandPalette />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className={`transition-all duration-500 min-h-screen ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-64'}`}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page-specific content */}
        <div className="px-6 lg:px-12 pb-20 stagger-load">
          {children}
        </div>

        {/* Decorative background element */}
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none translate-x-1/2 translate-y-1/2" />
      </main>
    </div>
  );
};

export default DashboardLayout;
