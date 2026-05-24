import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createBooking } from '../api/bookingApi';
import { cancelAdminEvent, getEventById } from '../api/eventApi';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Loader from '../components/ui/Loader.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function EventDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isUser } = useAuth();
  const [eventItem, setEventItem] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState(location.state?.message || '');
  const [error, setError] = useState('');

  const availableSeats = eventItem?.availableSeats ?? eventItem?.totalSeats ?? 0;
  const maxSelectableTickets = useMemo(() => Math.min(5, Math.max(availableSeats, 1)), [availableSeats]);
  const ticketOptions = useMemo(
    () => Array.from({ length: maxSelectableTickets }, (_, index) => index + 1),
    [maxSelectableTickets]
  );

  const loadEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getEventById(id);
      setEventItem(data);
      setTicketCount((current) => Math.min(Math.max(current, 1), Math.max(Math.min(5, data.availableSeats ?? data.totalSeats), 1)));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!isUser) {
      return;
    }

    setError('');
    setMessage('');
    setBooking(true);

    try {
      await createBooking({ eventId: id, ticketCount });
      setMessage('Booking confirmed');
      await loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create booking');
    } finally {
      setBooking(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!isAdmin) {
      return;
    }

    const confirmed = window.confirm(`Cancel ${eventItem.title}?`);
    if (!confirmed) {
      return;
    }

    setError('');
    setMessage('');
    setCancelling(true);

    try {
      await cancelAdminEvent(id);
      setMessage('Event cancelled successfully');
      await loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to cancel event');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-border bg-surface/95 p-8 shadow-soft dark:border-border-dark dark:bg-surface-dark/95">
        <Loader label="Loading event details..." />
      </div>
    );
  }

  if (!eventItem) {
    return (
      <section className="space-y-4">
        <Link to="/events" className="text-sm font-semibold text-primary-600 transition hover:text-primary-800">
          ← Back to events
        </Link>
        {error && <div className="rounded-3xl bg-danger-50 px-4 py-3 text-sm text-danger-700">{error}</div>}
      </section>
    );
  }

  const isBookable = eventItem.status === 'ACTIVE' && availableSeats > 0;

  return (
    <section className="space-y-8">
      <Toast message={message || error} variant={error ? 'danger' : 'success'} onClose={() => { setMessage(''); setError(''); }} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Event details</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground dark:text-foreground-inverse">{eventItem.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-foreground-muted dark:text-foreground-inverse-muted">{eventItem.description}</p>
        </div>
        <Link to="/events" className="text-sm font-semibold text-foreground transition hover:text-foreground dark:text-foreground-inverse-muted dark:hover:text-foreground-inverse">
          ← Return to browse
        </Link>
      </div>

      {isAdmin && (
        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate(`/events/${id}/edit`)}>
            Edit event
          </Button>
          <Button type="button" variant="danger" onClick={handleCancelEvent} disabled={eventItem.status === 'CANCELLED' || cancelling}>
            {cancelling ? 'Cancelling...' : eventItem.status === 'CANCELLED' ? 'Cancelled' : 'Cancel event'}
          </Button>
          <Link
            to={`/events/${id}/bookings`}
            className="inline-flex items-center justify-center rounded-2xl border border-button-secondary-border bg-button-secondary px-4 py-2 text-sm font-semibold text-button-secondary-foreground transition duration-200 hover:bg-button-secondary-hover focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          >
            View bookings
          </Link>
        </div>
      )}

      <Card className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-primary-500/10 via-surface-soft to-surface p-6 dark:from-primary-500/10 dark:via-surface-dark/70 dark:to-surface-dark/90">
            {eventItem.imageUrl && (
              <img
                src={eventItem.imageUrl}
                alt={eventItem.title}
                className="mb-6 h-56 w-full rounded-[1.25rem] object-cover"
              />
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={eventItem.status === 'ACTIVE' ? 'success' : 'default'}>{eventItem.status}</Badge>
              {eventItem.category && <Badge variant="default">{eventItem.category}</Badge>}
              <Badge variant={availableSeats > 0 ? 'primary' : 'danger'}>{availableSeats > 0 ? `${availableSeats} seats available` : 'Sold out'}</Badge>
            </div>
            <p className="mt-6 text-sm leading-7 text-foreground-soft dark:text-foreground-inverse-muted">A beautifully designed event experience with smart booking choices and premium organization.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-border bg-surface-soft p-5 dark:border-border-dark dark:bg-surface-dark/80">
              <p className="text-xs uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">When</p>
              <p className="mt-3 text-base font-semibold text-foreground dark:text-foreground-inverse">{new Date(eventItem.eventDate).toLocaleString()}</p>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-surface-soft p-5 dark:border-border-dark dark:bg-surface-dark/80">
              <p className="text-xs uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">Location</p>
              <p className="mt-3 text-base font-semibold text-foreground dark:text-foreground-inverse">{eventItem.location}</p>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-surface-soft p-5 dark:border-border-dark dark:bg-surface-dark/80">
              <p className="text-xs uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">Category</p>
              <p className="mt-3 text-base font-semibold text-foreground dark:text-foreground-inverse">{eventItem.category || 'General'}</p>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-surface-soft p-5 dark:border-border-dark dark:bg-surface-dark/80">
              <p className="text-xs uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">Ticket price</p>
              <p className="mt-3 text-base font-semibold text-foreground dark:text-foreground-inverse">{eventItem.ticketPrice ? `₹${Number(eventItem.ticketPrice).toFixed(2)}` : 'Not set'}</p>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] border border-border bg-surface-soft p-5 dark:border-border-dark dark:bg-surface-dark/80">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">Total seats</p>
              <p className="mt-2 text-base font-semibold text-foreground dark:text-foreground-inverse">{eventItem.totalSeats}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">Booked tickets</p>
              <p className="mt-2 text-base font-semibold text-foreground dark:text-foreground-inverse">{eventItem.totalSeats - availableSeats}</p>
            </div>
          </div>
        </div>

        {isUser ? (
          <div className="space-y-6 rounded-[1.75rem] border border-border bg-surface-soft p-6 dark:border-border-dark dark:bg-surface-dark/80">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">Booking panel</p>
              <h2 className="mt-3 text-xl font-semibold text-foreground dark:text-foreground-inverse">Reserve your seat</h2>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground-soft dark:text-foreground-inverse-muted">Tickets</label>
              <select
                aria-label="Ticket quantity"
                value={ticketCount}
                onChange={(event) => setTicketCount(Number(event.target.value))}
                disabled={!isBookable || booking}
                className="form-input"
              >
                {ticketOptions.map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>

            <Button type="button" className="w-full" onClick={handleBooking} disabled={!isBookable || booking}>
              {booking ? 'Booking...' : isBookable ? 'Confirm booking' : 'Unavailable'}
            </Button>

            <p className="text-sm text-foreground-muted dark:text-foreground-inverse-muted">
              {eventItem.status === 'ACTIVE' ? 'Secure your place with a premium checkout flow.' : 'This event is not currently accepting bookings.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 rounded-[1.75rem] border border-border bg-surface-soft p-6 dark:border-border-dark dark:bg-surface-dark/80">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground-soft dark:text-foreground-inverse-muted">Admin view</p>
            <h2 className="text-xl font-semibold text-foreground dark:text-foreground-inverse">Manage this event</h2>
            <p className="text-sm leading-6 text-foreground-muted dark:text-foreground-inverse-muted">
              Admin accounts can edit details, cancel events, and review bookings. Booking actions are hidden for admin users.
            </p>
          </div>
        )}
      </Card>
    </section>
  );
}
