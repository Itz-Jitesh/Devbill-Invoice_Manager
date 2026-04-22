'use client';

import { useEffect, useRef } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import Icon from '@/components/ui/Icon';

/**
 * NotificationPanel component
 * @description A slide-out panel that displays the history of notifications.
 */
const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, clearAll, markAllAsRead } = useNotifications();
  const panelRef = useRef(null);

  // Mark all as read when opening
  useEffect(() => {
    if (isOpen) {
      markAllAsRead();
    }
  }, [isOpen, markAllAsRead]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside 
        ref={panelRef}
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-[#0e1322]/95 backdrop-blur-3xl border-l border-white/5 z-[70] shadow-2xl transition-transform duration-500 ease-emphasized ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Notifications</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-label mt-1">Activity Feed</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearAll}
                className="p-2.5 text-on-surface-variant hover:text-white transition-colors glass-card rounded-xl"
                title="Clear all"
              >
                <Icon name="delete_sweep" size="sm" />
              </button>
              <button 
                onClick={onClose}
                className="p-2.5 text-on-surface-variant hover:text-white transition-colors glass-card rounded-xl"
              >
                <Icon name="close" size="sm" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-on-surface-variant opacity-40">
                <Icon name="notifications_none" size="xl" className="mb-4" />
                <p className="text-sm font-body">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 group cursor-default ${
                    notif.read ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      notif.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                      notif.type === 'error' ? 'bg-red-500/20 text-red-400' :
                      notif.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-primary/20 text-primary'
                    }`}>
                      <Icon name={
                        notif.type === 'success' ? 'check_circle' :
                        notif.type === 'error' ? 'error' :
                        notif.type === 'warning' ? 'warning' :
                        'info'
                      } size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-on-surface font-medium leading-relaxed mb-1.5">{notif.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-on-surface-variant/40 font-label tracking-wide">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!notif.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-white/5 bg-white/[0.01]">
            <p className="text-[10px] text-center text-on-surface-variant/30 uppercase tracking-[0.2em] font-label">
              DevBill v1.0 • System Log
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NotificationPanel;
