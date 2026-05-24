export default function Modal({ open, title, children, footer, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-border/10 bg-surface/95 p-6 shadow-2xl dark:border-border-dark dark:bg-surface-dark/95">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground dark:text-foreground-inverse">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-foreground-soft transition hover:bg-surface-soft hover:text-foreground dark:hover:bg-surface-dark dark:hover:text-foreground-inverse">
            ✕
          </button>
        </div>
        <div className="mt-5">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
