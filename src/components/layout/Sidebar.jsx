'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';

const Sidebar = ({ isOpen, onClose }) => {
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

  const getLinkClass = (path) => {
    const isActive = pathname === path || pathname.startsWith(path + '/');
    return `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-200 group ${
      isActive
        ? 'bg-[var(--color-surface-hover)] text-[var(--color-primary)] font-medium'
        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] font-medium'
    }`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 flex flex-col p-5 border-r border-[var(--color-surface-border)] bg-[var(--color-background)] z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo Section */}
        <Link href="/" className="mb-8 px-3 block transition-opacity hover:opacity-80">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-primary)] font-headline">DevBill</h1>
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] font-medium mt-1">Freelance Manager</p>
        </Link>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              className={getLinkClass(item.path)}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            >
              <Icon name={item.icon} size="md" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="mt-auto pt-4 border-t border-[var(--color-surface-border)] relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-200 group ${
              isProfileOpen
                ? 'bg-[var(--color-surface-hover)] text-[var(--color-primary)]'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            <Icon name="account_circle" size="md" />
            <span className="font-medium text-sm">Profile</span>
            <span className={`material-symbols-outlined text-sm ml-auto transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {isProfileOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-full bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-md shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-[var(--color-surface-border)]">
                <p className="text-[var(--color-on-surface)] font-medium text-sm truncate">{displayName}</p>
                <p className="text-[var(--color-on-surface-variant)] text-xs truncate mt-0.5">{user?.email || 'No email'}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[var(--color-error)] hover:bg-[var(--color-surface-hover)] transition-colors text-sm font-medium"
              >
                <Icon name="logout" size="md" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
