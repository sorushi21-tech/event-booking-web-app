import { useEffect } from 'react';

const variantStyles = {
  success: 'bg-emerald-600 text-foreground-inverse',
  danger: 'bg-danger-600 text-foreground-inverse',
  neutral: 'bg-surface-dark text-foreground-inverse'
};

export default function Toast({ message, variant = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose?.(), 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl px-5 py-4 shadow-2xl shadow-slate-900/20 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium leading-6">{message}</p>
        <button onClick={onClose} className="text-foreground-inverse/80 transition hover:text-foreground-inverse">
          ×
        </button>
      </div>
    </div>
  );
}
