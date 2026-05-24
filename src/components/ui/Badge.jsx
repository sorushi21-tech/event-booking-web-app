const variants = {
  default: 'bg-surface-muted text-foreground dark:bg-surface-dark dark:text-foreground-inverse',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300',
  danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300'
};

export default function Badge({ variant = 'default', className = '', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
