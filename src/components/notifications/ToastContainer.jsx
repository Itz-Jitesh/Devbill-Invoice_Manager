'use client';

import { useToast } from '@/context/ToastContext';
import Icon from '@/components/ui/Icon';

/**
 * ToastContainer — Displays active toast notifications
 * @description Glassmorphism toasts positioned top-right
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'error':
        return 'border-error/30 bg-error/10 text-error';
      case 'warning':
        return 'border-tertiary/30 bg-tertiary/10 text-tertiary';
      default:
        return 'border-primary/30 bg-primary/10 text-primary';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto glass-panel rounded-xl px-5 py-4 border shadow-2xl
            flex items-center gap-3 min-w-[320px] max-w-[400px]
            ${getToastStyles(toast.type)}`}
        >
          <Icon name={getIcon(toast.type)} size="lg" />
          <p className="flex-1 text-sm font-medium text-on-surface">{toast.message}</p>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-on-surface-variant/50 hover:text-on-surface transition-colors"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
