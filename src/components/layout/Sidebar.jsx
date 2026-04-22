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
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      isActive
        ? 'bg-[#c4c0ff]/10 text-[#c4c0ff] shadow-[0_0_20px_rgba(196,192,255,0.1)]'
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 flex flex-col p-6 border-r border-white/10 bg-[#0e1322]/90 backdrop-blur-2xl z-50 transition-transform duration-500 ease-emphasized ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo Section */}
        <Link href="/" className="mb-12 px-4 block hover:opacity-80 transition-all hover:scale-105 active:scale-95">
          <h1 className="text-3xl font-light tracking-tight text-[#dee1f7] font-headline text-shadow-glow">DevBill</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-label mt-1">Freelance Manager</p>
        </Link>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-3">
          {navItems.map((item, index) => (
            <Link 
              key={item.name} 
              href={item.path} 
              className={getLinkClass(item.path)}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon name={item.icon} size="lg" className="transition-transform group-hover:scale-110" />
              <span className="font-medium text-sm tracking-wide">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="mt-auto pt-6 border-t border-white/5 relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              isProfileOpen
                ? 'bg-[#c4c0ff]/10 text-[#c4c0ff]'
                : 'text-[#c7c4d8] hover:text-[#dee1f7] hover:bg-white/5'
            }`}
          >
            <Icon name="account_circle" size="lg" />
            <span className="font-medium text-sm">Profile</span>
            <span className={`material-symbols-outlined text-sm ml-auto transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute left-0 bottom-full mb-4 w-full glass-card rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-300">
              <div className="p-5 border-b border-white/5">
                <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                <p className="text-[#c7c4d8] text-xs truncate opacity-60">{user?.email || 'No email'}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-4 text-[#c7c4d8] hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm"
              >
                <Icon name="logout" size="lg" />
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
