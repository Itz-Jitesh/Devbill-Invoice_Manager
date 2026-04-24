'use client';

import { useEffect, useRef } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import Icon from '@/components/ui/Icon';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, clearAll, markAllAsRead } = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      markAllAsRead();
    }
  }, [isOpen, markAllAsRead]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside 
        ref={panelRef}
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-[var(--color-surface)] border-l border-[var(--color-surface-border)] z-[70] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-[var(--color-surface-border)] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">Notifications</h2>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={clearAll}
                className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors rounded-md"
                title="Clear all"
              >
                <Icon name="delete_sweep" size="sm" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors rounded-md"
              >
                <Icon name="close" size="sm" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-[var(--color-on-surface-variant)]">
                <Icon name="notifications_none" size="lg" className="mb-2" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 rounded-md border transition-colors ${
                    notif.read ? 'bg-[var(--color-background)] border-transparent' : 'bg-[var(--color-surface-hover)] border-[var(--color-surface-border)]'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${
                      notif.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' :
                      notif.type === 'error' ? 'bg-[var(--color-error)]/10 text-[var(--color-error)]' :
                      notif.type === 'warning' ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]' :
                      'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    }`}>
                      <Icon name={
                        notif.type === 'success' ? 'check_circle' :
                        notif.type === 'error' ? 'error' :
                        notif.type === 'warning' ? 'warning' :
                        'info'
                      } size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-on-surface)] mb-1">{notif.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--color-on-surface-variant)]">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!notif.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default NotificationPanel;
