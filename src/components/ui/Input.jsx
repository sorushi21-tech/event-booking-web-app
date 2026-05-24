export default function Input({ label, type = 'text', id, error, children, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-foreground-soft dark:text-foreground-inverse-muted">{label}</span>}
      <div className="relative">
        <input
          id={id}
          type={type}
          className={`w-full rounded-3xl border border-input-border bg-input px-4 py-3 text-sm text-input-text shadow-sm outline-none transition duration-200 focus:border-input-focus focus:ring-2 focus:ring-input-focus disabled:cursor-not-allowed disabled:bg-input-disabled placeholder:text-input-placeholder ${className}`}
          {...props}
        />
        {children ? <div className="absolute inset-y-0 right-4 flex items-center">{children}</div> : null}
      </div>
      {error ? <p className="mt-2 text-sm text-danger-700 dark:text-danger-300">{error}</p> : null}
    </label>
  );
}
