import Sidebar from './Sidebar';
import Header from './Header';
import CommandPalette from '@/components/ui/CommandPalette';

/**
 * DashboardLayout component
 * @description Provides the standard layout for authenticated dashboard pages.
 * Sidebar and Header are client components (Sidebar uses usePathname).
 * This wrapper itself doesn't need "use client".
 */
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      {/* Search and Command Palette */}
      <CommandPalette />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="pl-64 min-h-screen">
        <Header />

        {/* Page-specific content */}
        <div className="px-12 pb-20">{children}</div>

        {/* Decorative background element */}
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none translate-x-1/2 translate-y-1/2" />
      </main>
    </div>
  );
};

export default DashboardLayout;
