export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  const variants = {
    primary: 'bg-button-primary text-button-primary-foreground shadow-lg hover:bg-button-primary-hover',
    secondary: 'border border-button-secondary-border bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary-hover',
    subtle: 'bg-surface-muted text-foreground hover:bg-surface-soft dark:text-foreground-inverse',
    success: 'bg-button-success text-button-success-foreground shadow-lg hover:bg-button-success-hover',
    danger: 'bg-button-danger text-button-danger-foreground shadow-lg hover:bg-button-danger-hover'
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:pointer-events-none disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
