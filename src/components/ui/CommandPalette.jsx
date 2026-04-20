'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';

/**
 * CommandPalette Component
 * @description Listens for Cmd+K (or Ctrl+K) and opens a search modal.
 */
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#1a1f2f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-4 border-b border-white/10">
          <Icon name="search" size="lg" className="text-[#c7c4d8] mr-3" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none text-[#dee1f7] placeholder-[#c7c4d8] focus:outline-none text-lg"
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px] text-[#c7c4d8] font-medium">
            <span className="text-xs">ESC</span>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-xs font-bold text-[#c7c4d8]/50 uppercase tracking-widest px-2 mb-2">Quick Actions</p>
          <div className="space-y-1">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer text-[#dee1f7] transition-colors group">
              <Icon name="add_circle" size="lg" className="text-[#c4c0ff]" />
              <span className="font-medium">Create New Invoice</span>
              <span className="ml-auto text-xs text-[#c7c4d8] opacity-0 group-hover:opacity-100 italic transition-opacity">Press Enter</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer text-[#dee1f7] transition-colors group">
              <Icon name="person_add" size="lg" className="text-[#c4c0ff]" />
              <span className="font-medium">Add New Client</span>
              <span className="ml-auto text-xs text-[#c7c4d8] opacity-0 group-hover:opacity-100 italic transition-opacity">Press Enter</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-[#c7c4d8]">
            <span className="flex items-center gap-1"><span className="p-1 bg-white/10 rounded text-micro">↑↓</span> to navigate</span>
            <span className="flex items-center gap-1"><span className="p-1 bg-white/10 rounded text-micro">↵</span> to select</span>
          </div>
          <p className="text-xs text-[#c7c4d8]/50">DevBill Command Palette</p>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />
    </div>
  );
}
