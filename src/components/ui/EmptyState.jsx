export default function EmptyState({ title = 'No items yet', description = 'Nothing to show here right now.', action }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border-muted bg-surface-soft/80 p-8 text-center text-foreground-soft shadow-sm dark:border-border-dark dark:bg-surface-dark/70 dark:text-foreground-inverse-muted">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">Empty state</p>
      <h2 className="mt-4 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-foreground-muted dark:text-foreground-inverse-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
