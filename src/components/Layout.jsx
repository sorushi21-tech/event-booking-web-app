import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './ui/Button.jsx';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, isUser, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: isAdmin ? 'Manage Events' : 'Events', path: '/events' },
    ...(isUser ? [{ label: 'My Bookings', path: '/bookings' }] : []),
    { label: 'Profile', path: '/profile' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
    : 'EB';

  return (
    <div className="min-h-screen bg-surface text-foreground dark:bg-surface-dark dark:text-foreground-inverse">
      <header className="sticky top-0 z-50 border-b border-border/10 bg-surface/90 backdrop-blur-xl shadow-sm dark:border-border-dark dark:bg-surface-dark/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-500 text-base font-semibold text-foreground-inverse shadow-lg shadow-primary-500/20">
              EB
            </div>
            <div>
              <p className="text-lg font-semibold">EventBooking</p>
              <span className="text-sm text-foreground-soft dark:text-foreground-inverse-muted">Premium event platform</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-foreground shadow-sm transition hover:bg-surface-soft dark:border-border-dark dark:bg-surface-dark dark:text-foreground-inverse"
            >
              <span className="text-xl">☰</span>
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>

          <nav className={`flex flex-col gap-3 border-t border-border pt-4 transition-all duration-300 sm:flex-row sm:border-none sm:pt-0 ${menuOpen ? 'max-h-[480px]' : 'max-h-0 overflow-hidden'} sm:max-h-full dark:border-border-dark`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-surface-dark text-foreground-inverse shadow-sm dark:bg-surface-soft dark:text-foreground' : 'text-foreground-muted hover:bg-surface-soft hover:text-foreground dark:text-foreground-inverse-muted dark:hover:bg-surface-dark dark:hover:text-foreground-inverse'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="hidden items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground-soft shadow-sm dark:border-border-dark dark:bg-surface-dark dark:text-foreground-inverse sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-muted text-sm font-semibold text-foreground dark:bg-surface-dark dark:text-foreground-inverse">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user?.name || 'Guest'}</p>
                <p className="text-xs text-foreground-soft dark:text-foreground-inverse-muted">{user?.role || 'Member'}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
