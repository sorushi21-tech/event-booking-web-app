import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';

export default function AuthForm({
  title,
  submitLabel,
  fields,
  values,
  onChange,
  onSubmit,
  error,
  success,
  loading = false,
  footerText,
  footerLink,
  footerLinkText
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-[2rem] border border-border/10 bg-surface/95 p-8 shadow-soft dark:border-border-dark dark:bg-surface-dark/95">
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Welcome back</p>
            <h1 className="text-3xl font-semibold text-foreground dark:text-foreground-inverse">{title}</h1>
            <p className="text-sm text-foreground-soft dark:text-foreground-inverse-muted">Secure access to your event dashboard and booking tools.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {fields.map(({ label, name, type = 'text', ...field }) => (
              <Input key={name} label={label} type={type === 'password' ? (showPassword ? 'text' : 'password') : type} id={name} name={name} value={values[name]} onChange={onChange} disabled={loading}>
                {type === 'password' ? (
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground-soft transition hover:bg-surface-soft dark:bg-surface-dark dark:text-foreground-inverse-muted dark:hover:bg-surface-dark/90"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                ) : null}
              </Input>
            ))}

            {error && <div className="rounded-3xl bg-danger-50 px-4 py-3 text-sm text-danger-700">{error}</div>}
            {success && <div className="rounded-3xl bg-success-50 px-4 py-3 text-sm text-success-700">{success}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : submitLabel}
            </Button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface-soft/80 p-5 text-center text-sm text-foreground-muted shadow-sm dark:border-border-dark dark:bg-surface-dark/80 dark:text-foreground-inverse-muted">
          {footerText}{' '}
          <Link to={footerLink} className="font-semibold text-foreground transition hover:text-primary-600 dark:text-foreground-inverse dark:hover:text-primary-300">
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
