'use client';

import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';

/**
 * Header component for the Dashboard
 * @description Renders the top navigation bar with a search bar and user profile controls.
 */
const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const displayName = user?.name || user?.username || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex justify-between items-center w-full px-6 lg:px-12 py-6 lg:py-8 bg-transparent">
      {/* Mobile Menu Button */}
      <button 
        type="button"
        onClick={onMenuClick}
        className="lg:hidden mr-4 p-2 text-on-surface-variant hover:text-primary transition-colors glass-card rounded-xl"
      >
        <Icon name="menu" size="lg" />
      </button>

      {/* Search Bar Section */}
      <div className="flex-1 max-w-xl group">
        <div className="relative">
          <Icon name="search" size="lg" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all font-body input-glow"
          />
        </div>
      </div>

      {/* Utility and Profile Section */}
      <div className="flex items-center gap-4 lg:gap-6 ml-4 lg:ml-8">
        <button type="button" className="hidden sm:flex text-on-surface-variant hover:text-primary transition-all duration-300 glass-card p-2.5 rounded-xl">
          <Icon name="notifications" size="lg" />
        </button>
        
        <div className="flex items-center gap-3 glass-card p-1.5 pr-4 rounded-2xl cursor-pointer hover:border-primary/20 transition-all">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/30 to-primary-container/20 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
            {userInitial}
          </div>
          <span className="hidden md:block text-xs font-semibold text-on-surface-variant/80 tracking-wide">{displayName}</span>
        </div>
      </div>
    </header>
  );
};


export default Header;
