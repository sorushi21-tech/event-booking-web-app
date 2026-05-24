export default function Loader({ label = 'Loading...', className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 text-sm font-medium text-foreground-muted dark:text-foreground-inverse-muted ${className}`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {label}
    </div>
  );
}
