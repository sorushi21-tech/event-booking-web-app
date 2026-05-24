import { Link } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';

export default function ForbiddenPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <Card className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">403</p>
        <h1 className="text-3xl font-semibold text-foreground dark:text-foreground-inverse">Access denied</h1>
        <p className="text-sm leading-6 text-foreground-muted dark:text-foreground-inverse-muted">
          Your account role does not have permission to open this page.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-2xl bg-button-primary px-4 py-2 text-sm font-semibold text-button-primary-foreground transition hover:bg-button-primary-hover"
        >
          Back to dashboard
        </Link>
      </Card>
    </section>
  );
}
