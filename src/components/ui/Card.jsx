export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-[2rem] border border-surface bg-surface p-6 shadow-soft backdrop-blur-xl transition duration-200 dark:border-surface-dark dark:bg-surface-dark ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
