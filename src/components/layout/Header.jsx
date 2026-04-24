'use client';

import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import Icon from '@/components/ui/Icon';

const Header = ({ onMenuClick, onNotificationsClick }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const displayName = user?.name || user?.username || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex justify-between items-center w-full px-6 lg:px-8 py-5 bg-[var(--color-background)] border-b border-[var(--color-surface-border)]">
      {/* Mobile Menu Button */}
      <button 
        type="button"
        onClick={onMenuClick}
        className="lg:hidden mr-4 p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors rounded-md"
      >
        <Icon name="menu" size="lg" />
      </button>

      {/* Search Bar Section */}
      <div className="flex-1 max-w-lg group">
        <div className="relative">
          <Icon name="search" size="md" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-md py-2.5 pl-10 pr-4 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:border-[var(--color-accent)] transition-colors font-body"
          />
        </div>
      </div>

      {/* Utility and Profile Section */}
      <div className="flex items-center gap-4 lg:gap-6 ml-4 lg:ml-8">
        <button 
          type="button" 
          onClick={onNotificationsClick}
          className="relative flex text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors p-2 rounded-md hover:bg-[var(--color-surface-hover)]"
        >
          <Icon name="notifications" size="md" />
          {unreadCount > 0 && (
            <span className="absolute 1 top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-[var(--color-on-surface)]">
              {unreadCount}
            </span>
          )}
        </button>
        
        <div className="flex items-center gap-3 p-1.5 pr-3 rounded-md cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors border border-transparent hover:border-[var(--color-surface-border)]">
          <div className="h-8 w-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-surface-border)] flex items-center justify-center text-[var(--color-on-surface)] font-medium text-sm">
            {userInitial}
          </div>
          <span className="hidden md:block text-sm font-medium text-[var(--color-on-surface)]">{displayName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
