import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ToastNotification
 *
 * A lightweight, accessible toast / snackbar component that matches the
 * existing RoadSathi design system (slate / brand palette, rounded-xl, shadows).
 *
 * Props:
 *   message  {string}   — Text to display inside the toast.
 *   type     {string}   — 'warning' | 'error' | 'info' | 'success'  (default: 'warning')
 *   visible  {boolean}  — Controls visibility; parent manages state.
 *   onClose  {function} — Called when the toast is dismissed.
 *   duration {number}   — Auto-dismiss after N ms (default 5000, set 0 to disable).
 */
export default function ToastNotification({
  message,
  type = 'warning',
  visible = false,
  onClose,
  duration = 5000,
}) {
  const [exiting, setExiting] = useState(false);

  // Auto-dismiss after `duration` ms
  useEffect(() => {
    if (!visible || duration === 0) return;
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [visible, duration]);

  // Reset exit state when newly shown
  useEffect(() => {
    if (visible) setExiting(false);
  }, [visible]);

  const handleClose = () => {
    setExiting(true);
    // Small delay for the slide-out animation before informing parent
    setTimeout(() => {
      setExiting(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!visible && !exiting) return null;

  // ── Style maps ───────────────────────────────────────────────────────────
  const styles = {
    warning: {
      container: 'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700/60',
      icon:      'text-amber-600 dark:text-amber-400',
      text:      'text-amber-900 dark:text-amber-200',
      close:     'text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200',
      bar:       'bg-amber-400 dark:bg-amber-500',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-700/60',
      icon:      'text-red-600 dark:text-red-400',
      text:      'text-red-900 dark:text-red-200',
      close:     'text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-200',
      bar:       'bg-red-400 dark:bg-red-500',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-950/80 border-blue-300 dark:border-blue-700/60',
      icon:      'text-blue-600 dark:text-blue-400',
      text:      'text-blue-900 dark:text-blue-200',
      close:     'text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-200',
      bar:       'bg-blue-400 dark:bg-blue-500',
    },
    success: {
      container: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700/60',
      icon:      'text-emerald-600 dark:text-emerald-400',
      text:      'text-emerald-900 dark:text-emerald-200',
      close:     'text-emerald-400 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-200',
      bar:       'bg-emerald-400 dark:bg-emerald-500',
    },
  };

  const s = styles[type] || styles.warning;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position:   'fixed',
        bottom:     '1.5rem',
        left:       '50%',
        transform:  'translateX(-50%)',
        zIndex:     9999,
        minWidth:   '320px',
        maxWidth:   'calc(100vw - 2rem)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity:    exiting ? 0 : 1,
        transform:  exiting
          ? 'translateX(-50%) translateY(10px)'
          : 'translateX(-50%) translateY(0)',
      }}
    >
      <div
        className={`
          relative flex items-start gap-3
          px-4 py-3.5 rounded-2xl border shadow-2xl
          backdrop-blur-md overflow-hidden
          ${s.container}
        `}
      >
        {/* Coloured left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${s.bar}`} />

        {/* Icon */}
        <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ml-1 ${s.icon}`} />

        {/* Message */}
        <p className={`flex-1 text-sm font-medium leading-snug ${s.text}`}>
          {message}
        </p>

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss notification"
          className={`shrink-0 p-1 rounded-lg transition-colors ${s.close}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
