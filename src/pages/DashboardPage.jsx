import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getEvents } from '../api/eventApi';
import { getMyBookings } from '../api/bookingApi';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function DashboardPage() {
  const { user, isAdmin, isUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      getEvents({ page: 0, size: 4 }),
      isUser ? getMyBookings({ page: 0, size: 5 }) : Promise.resolve({ data: { content: [] } })
    ])
      .then(([eventsResponse, bookingsResponse]) => {
        setEvents(eventsResponse.data.content || []);
        setTotalEvents(eventsResponse.data.totalElements || 0);
        setBookings(bookingsResponse.data.content || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const bookedCount = bookings.filter((booking) => booking.status === 'CONFIRMED').length;
  const upcomingEvents = events.slice(0, 4);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-gradient-to-br from-primary-600/15 via-surface-soft to-surface p-8 shadow-soft dark:from-primary-500/10 dark:via-surface-dark/80 dark:to-surface-dark/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-foreground dark:text-foreground-inverse">Welcome back, {user?.name?.split(' ')[0] || 'organizer'}.</h1>
            <p className="mt-3 max-w-2xl text-sm text-foreground-muted dark:text-foreground-inverse-muted">Monitor events, bookings, and next steps from one modern control center.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/events" className="inline-flex min-w-[140px] items-center justify-center rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary-300 hover:bg-primary-50 dark:border-border-dark dark:bg-surface-dark dark:text-foreground-inverse dark:hover:bg-surface-dark">
              {isAdmin ? 'Manage events' : 'Browse events'}
            </Link>
            {isUser && (
              <Link to="/bookings" className="inline-flex min-w-[140px] items-center justify-center rounded-2xl bg-button-primary text-button-primary-foreground px-4 py-3 text-sm font-semibold transition hover:bg-button-primary-hover">
                View bookings
              </Link>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <Card>
          <Loader label="Refreshing dashboard data..." />
        </Card>
      ) : error ? (
        <Card className="bg-danger-50 text-danger-900">
          <p className="text-sm">{error}</p>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground-soft dark:text-foreground-inverse-muted">Events</p>
              <h2 className="text-3xl font-semibold text-foreground dark:text-foreground-inverse">{totalEvents}</h2>
              <p className="text-sm text-foreground-muted dark:text-foreground-inverse-muted">Active and upcoming events in your planning pipeline.</p>
            </Card>

            <Card className="space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground-soft dark:text-foreground-inverse-muted">Bookings</p>
              <h2 className="text-3xl font-semibold text-foreground dark:text-foreground-inverse">{bookedCount}</h2>
              <p className="text-sm text-foreground-muted dark:text-foreground-inverse-muted">
                {isAdmin ? 'Booking actions are available from each event.' : 'Confirmed bookings from the latest events.'}
              </p>
            </Card>
          </div>

          <Card className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground-soft dark:text-foreground-inverse-muted">Quick actions</p>
            <div className="grid gap-3">
              <Link to="/events" className="rounded-2xl border border-border bg-surface px-4 py-4 text-sm font-semibold text-foreground transition hover:border-primary-300 hover:bg-primary-50 dark:border-border-dark dark:bg-surface-dark dark:text-foreground-inverse dark:hover:bg-surface-dark">
                {isAdmin ? 'Manage event listings' : 'Explore event listings'}
              </Link>
              {isUser && (
                <Link to="/bookings" className="rounded-2xl bg-button-primary text-button-primary-foreground px-4 py-4 text-sm font-semibold transition hover:bg-button-primary-hover">
                  Manage bookings
                </Link>
              )}
            </div>
          </Card>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground-soft dark:text-foreground-inverse-muted">Upcoming events</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground dark:text-foreground-inverse">What’s next</h2>
            </div>
            <Badge variant="primary">{totalEvents} events</Badge>
          </div>

          {upcomingEvents.length === 0 ? (
            <EmptyState title="No upcoming events" description="Create or import events to see them here." />
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-[1.5rem] border border-border bg-surface-soft p-5 dark:border-border-dark dark:bg-surface-dark/80">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground dark:text-foreground-inverse">{event.title}</h3>
                      <p className="text-sm text-foreground-muted dark:text-foreground-inverse-muted">{event.location}</p>
                    </div>
                    <Badge variant={event.status === 'ACTIVE' ? 'success' : 'default'}>{event.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-foreground-muted dark:text-foreground-inverse-muted">{new Date(event.eventDate).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground-soft dark:text-foreground-inverse-muted">Recent bookings</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground dark:text-foreground-inverse">Latest activity</h2>
            </div>
            <Badge variant="success">{isAdmin ? 'Admin' : `${bookedCount} confirmed`}</Badge>
          </div>

          {isAdmin ? (
            <EmptyState title="Admin bookings" description="Open an event and choose View bookings to review ticket activity." />
          ) : bookings.length === 0 ? (
            <EmptyState title="No recent bookings" description="Your latest booking activity will appear here." />
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-[1.5rem] border border-border bg-surface-soft p-4 dark:border-border-dark dark:bg-surface-dark/80">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-foreground dark:text-foreground-inverse">{booking.eventTitle}</h3>
                      <p className="text-sm text-foreground-muted dark:text-foreground-inverse-muted">{new Date(booking.eventDate).toLocaleString()}</p>
                    </div>
                    <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'danger'}>{booking.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
