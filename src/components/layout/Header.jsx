'use client';

import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';

/**
 * Header component for the Dashboard
 * @description Renders the top navigation bar with a search bar and user profile controls.
 */
const Header = () => {
  const { user } = useAuth();
  const displayName = user?.name || user?.username || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex justify-between items-center w-full px-12 py-8 bg-transparent">
      {/* Search Bar Section */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Icon name="search" size="lg" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search invoices or clients..."
            className="w-full text-greya bg-surface-container-low border-none rounded-full py-3 pl-12 pr-6 text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Utility and Profile Section */}
      <div className="flex items-center gap-6 ml-8">
        <button type="button" className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary/20 rounded-full p-2">
          <Icon name="notifications" size="lg" />
        </button>
        {/* User Avatar - Clean Initial */}
        <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
          {userInitial}
        </div>
      </div>
    </header>
  );
};

export default Header;
