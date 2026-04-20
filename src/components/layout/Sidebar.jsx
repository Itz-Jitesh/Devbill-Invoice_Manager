'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';

/**
 * Sidebar component for Dashboard navigation
 * @description Renders the left-hand navigation sidebar with links to various sections.
 * "use client" required: uses usePathname() hook for active link detection.
 * NavLink (react-router-dom) → Link (next/link) + usePathname pattern.
 */
const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const displayName = user?.name || user?.username || 'User';

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Clients', icon: 'group', path: '/clients' },
    { name: 'Invoices', icon: 'receipt_long', path: '/invoices' },
    { name: 'Settings', icon: 'settings', path: '/settings' },
  ];

  /**
   * Compute active class — matches the NavLink isActive behaviour from react-router.
   * A path is active if it exactly matches or is a parent of the current pathname.
   */
  const getLinkClass = (path) => {
    const isActive = pathname === path || pathname.startsWith(path + '/');
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group active:scale-95 ${
      isActive
        ? 'bg-[#c4c0ff]/10 text-[#c4c0ff]'
        : 'text-[#c7c4d8] hover:text-[#dee1f7] hover:bg-white/5'
    }`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col p-6 border-r border-white/10 bg-[#0e1322]/80 backdrop-blur-xl z-50">
      {/* Logo Section */}
      <Link href="/" className="mb-12 px-4 block hover:opacity-80 transition-opacity">
        <h1 className="text-2xl font-light tracking-tight text-[#dee1f7] font-headline">DevBill</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-label mt-1">Freelance Manager</p>
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.name} href={item.path} className={getLinkClass(item.path)}>
            <Icon name={item.icon} size="lg" />
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="mt-auto pt-6 border-t border-white/5 relative" ref={profileRef}>
        <button
          type="button"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group active:scale-95 ${
            isProfileOpen
              ? 'bg-[#c4c0ff]/10 text-[#c4c0ff] border-r-2 border-[#c4c0ff]'
              : 'text-[#c7c4d8] hover:text-[#dee1f7] hover:bg-white/5'
          }`}
        >
          <Icon name="account_circle" size="lg" />
          <span className="font-medium text-sm">Profile</span>
          <span className={`material-symbols-outlined text-sm ml-auto transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
        </button>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div className="absolute left-0 bottom-full mb-2 w-64 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="p-4 border-b border-white/5">
              <p className="text-white font-semibold text-sm truncate">{displayName}</p>
              <p className="text-[#c7c4d8] text-xs truncate">{user?.email || 'No email'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                setIsProfileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#c7c4d8] hover:bg-white/5 hover:text-error transition-colors"
            >
              <Icon name="logout" size="lg" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
