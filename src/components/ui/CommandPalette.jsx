'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/Icon';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 bg-black/50">
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-[var(--color-surface-border)]">
              <Icon name="search" size="md" className="text-[var(--color-on-surface-variant)] mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] focus:outline-none text-base"
              />
              <div className="flex items-center px-2 py-1 bg-[var(--color-surface-hover)] rounded text-xs text-[var(--color-on-surface-variant)] font-medium">
                ESC
              </div>
            </div>
            
            <div className="p-2">
              <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider px-3 mb-2 mt-2">Quick Actions</p>
              <div className="space-y-1">
                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-[var(--color-surface-hover)] cursor-pointer text-[var(--color-on-surface)] transition-colors group">
                  <Icon name="add_circle" size="md" className="text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors" />
                  <span className="font-medium text-sm">Create New Invoice</span>
                  <span className="ml-auto text-xs text-[var(--color-on-surface-variant)] opacity-0 group-hover:opacity-100 transition-opacity">Press Enter</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-[var(--color-surface-hover)] cursor-pointer text-[var(--color-on-surface)] transition-colors group">
                  <Icon name="person_add" size="md" className="text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors" />
                  <span className="font-medium text-sm">Add New Client</span>
                  <span className="ml-auto text-xs text-[var(--color-on-surface-variant)] opacity-0 group-hover:opacity-100 transition-opacity">Press Enter</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--color-background)] px-4 py-2 border-t border-[var(--color-surface-border)] flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-[var(--color-on-surface-variant)]">
                <span className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded text-[10px]">↑↓</span> navigate</span>
                <span className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded text-[10px]">↵</span> select</span>
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)]">Command Palette</p>
            </div>
          </motion.div>
          <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </AnimatePresence>
  );
}
