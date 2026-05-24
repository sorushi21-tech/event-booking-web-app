import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/bookingApi';
import { cancelAdminEvent, createEvent, getEvents } from '../api/eventApi';
import { useAuth } from '../context/AuthContext.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Loader from '../components/ui/Loader.jsx';
import Modal from '../components/ui/Modal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Toast from '../components/ui/Toast.jsx';

const emptyEvent = {
  title: '',
  description: '',
  location: '',
  eventDate: '',
  totalSeats: 50
};

export default function EventsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0, first: true, last: true });
  const [form, setForm] = useState(emptyEvent);
  const [message, setMessage] = useState(location.state?.message || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingEventId, setBookingEventId] = useState('');
  const [cancelEventItem, setCancelEventItem] = useState(null);
  const [cancellingEventId, setCancellingEventId] = useState('');

  const loadEvents = async (targetPage = page) => {
    const { data } = await getEvents({ page: targetPage, size: 10 });
    setEvents(data.content || []);
    setPageInfo({
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      first: data.first ?? true,
      last: data.last ?? true
    });
  };

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }
    setLoading(true);
    loadEvents(page)
      .catch(() => setError('Unable to load events'))
      .finally(() => setLoading(false));
  }, [page]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'totalSeats' ? Number(value) : value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await createEvent(form);
      setForm(emptyEvent);
      setPage(0);
      await loadEvents(0);
      setMessage('Event created successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create event');
    }
  };

  const handleBook = async (eventItem) => {
    setError('');
    setMessage('');
    setBookingEventId(eventItem.id);
    try {
      await createBooking({ eventId: eventItem.id, ticketCount: 1 });
      await loadEvents(page);
      setMessage('Booking confirmed');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create booking');
    } finally {
      setBookingEventId('');
    }
  };

  const handleCancelEvent = async () => {
    if (!cancelEventItem) {
      return;
    }

    setError('');
    setMessage('');
    setCancellingEventId(cancelEventItem.id);

    try {
      await cancelAdminEvent(cancelEventItem.id);
      setCancelEventItem(null);
      await loadEvents(page);
      setMessage('Event cancelled successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to cancel event');
    } finally {
      setCancellingEventId('');
    }
  };

  return (
    <div className={`space-y-8 ${isAdmin ? 'lg:space-y-0 lg:grid lg:grid-cols-[380px_1fr] lg:gap-8' : ''}`}>
      <Toast message={message || error} variant={error ? 'danger' : 'success'} onClose={() => { setMessage(''); setError(''); }} />
      <Modal
        open={Boolean(cancelEventItem)}
        title="Cancel event"
        onClose={() => setCancelEventItem(null)}
        footer={(
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setCancelEventItem(null)} disabled={Boolean(cancellingEventId)}>
              Keep event
            </Button>
            <Button type="button" variant="danger" onClick={handleCancelEvent} disabled={Boolean(cancellingEventId)}>
              {cancellingEventId ? 'Cancelling...' : 'Cancel event'}
            </Button>
          </div>
        )}
      >
        <p className="text-sm leading-6 text-foreground-muted dark:text-foreground-inverse-muted">
          This will mark {cancelEventItem?.title} as CANCELLED and cancel all confirmed bookings for this event.
        </p>
      </Modal>

      {isAdmin && (
        <Card className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Admin tools</p>
            <h1 className="mt-3 text-2xl font-semibold text-foreground dark:text-foreground-inverse">Create a new event</h1>
            <p className="mt-2 text-sm text-foreground-muted dark:text-foreground-inverse-muted">Publish engaging events with a premium look and smooth user experience.</p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Title" name="title" value={form.title} onChange={handleChange} maxLength="120" />
            <Input label="Location" name="location" value={form.location} onChange={handleChange} maxLength="160" />
            <Input label="Date & time" name="eventDate" type="datetime-local" value={form.eventDate} onChange={handleChange} />
            <Input label="Total seats" name="totalSeats" type="number" min="1" value={form.totalSeats} onChange={handleChange} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground-soft dark:text-foreground-inverse-muted">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength="1000"
                className="form-input min-h-[140px] resize-none"
                required
              />
            </label>
            <Button type="submit" className="w-full">Create event</Button>
          </form>
        </Card>
      )}

      <section className="space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-surface-dark via-surface-dark to-surface-dark/90 p-8 text-foreground-inverse shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-primary-300">Events</p>
              <h2 className="mt-3 text-3xl font-semibold">Discover upcoming experiences</h2>
              <p className="mt-2 max-w-2xl text-sm text-foreground-inverse-muted">Browse premium events, check availability, and book tickets with a refined booking flow.</p>
            </div>
            <Button type="button" variant="secondary" onClick={() => loadEvents(page)}>
              Refresh list
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-soft dark:border-border-dark dark:bg-surface-dark/95">
            <Loader label="Loading event listings..." />
          </div>
        ) : events.length === 0 ? (
          <EmptyState title="No events available" description="Create the first event or try again later." action={<Button type="button" variant="primary" onClick={() => loadEvents(page)}>Reload</Button>} />
        ) : (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {events.map((eventItem) => {
              const available = eventItem.availableSeats ?? eventItem.totalSeats;
              const isSoldOut = available <= 0 || eventItem.status !== 'ACTIVE';
              const isCancelled = eventItem.status === 'CANCELLED';
              return (
                <Card key={eventItem.id} className="group overflow-hidden">
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-primary-500/10 via-secondary-200/10 to-surface-soft p-5 text-foreground dark:bg-surface-dark/80 dark:text-foreground-inverse">
                    <div className="absolute -right-8 top-8 h-24 w-24 rounded-full bg-primary-500/15 blur-3xl" />
                    <div className="absolute left-4 top-10 h-20 w-20 rounded-full bg-secondary-500/10 blur-3xl" />
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Event spotlight</p>
                    <h3 className="mt-4 text-xl font-semibold">{eventItem.title}</h3>
                    <p className="mt-3 text-sm text-foreground-muted dark:text-foreground-inverse-muted">{eventItem.location}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-foreground-muted dark:text-foreground-inverse-muted">
                      <Badge variant={eventItem.status === 'ACTIVE' ? 'success' : 'default'}>{eventItem.status}</Badge>
                      <Badge variant={isSoldOut ? 'danger' : 'primary'}>{available} seats left</Badge>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <p className="text-sm leading-6 text-foreground-muted dark:text-foreground-inverse-muted">{eventItem.description || 'Enjoy a thoughtfully curated event experience with premium amenities and easy booking.'}</p>
                    <div className="grid gap-3 text-sm text-foreground-muted dark:text-foreground-inverse-muted sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground-soft dark:text-foreground-inverse-muted">Date</p>
                        <p className="mt-2 font-medium">{new Date(eventItem.eventDate).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground-soft dark:text-foreground-inverse-muted">Total seats</p>
                        <p className="mt-2 font-medium">{eventItem.totalSeats}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {isAdmin && (
                      <Button type="button" variant="secondary" className="flex-1 min-w-[120px]" onClick={() => navigate(`/events/${eventItem.id}/edit`)}>
                        Edit event
                      </Button>
                    )}
                    {isAdmin && (
                      <Button type="button" variant="danger" className="flex-1 min-w-[120px]" onClick={() => setCancelEventItem(eventItem)} disabled={isCancelled || cancellingEventId === eventItem.id}>
                        {isCancelled ? 'Cancelled' : 'Cancel event'}
                      </Button>
                    )}
                    <Button type="button" variant="secondary" className="flex-1 min-w-[120px]" onClick={() => navigate(`/events/${eventItem.id}`)}>
                      View details
                    </Button>
                    {!isAdmin && (
                      <Button
                        type="button"
                        variant="primary"
                        className="flex-1 min-w-[120px]"
                        disabled={isSoldOut || bookingEventId === eventItem.id}
                        onClick={() => handleBook(eventItem)}
                      >
                        {bookingEventId === eventItem.id ? 'Booking...' : isSoldOut ? 'Unavailable' : 'Book now'}
                      </Button>
                    )}
                  </div>
                </Card>
              );
              })}
            </div>

            {pageInfo.totalPages > 1 && (
              <div className="flex flex-col gap-3 rounded-[2rem] border border-border bg-surface-soft p-5 text-sm text-foreground-muted shadow-sm dark:border-border-dark dark:bg-surface-dark/80 dark:text-foreground-inverse-muted sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="secondary" onClick={() => setPage((current) => Math.max(current - 1, 0))} disabled={pageInfo.first || loading}>
                  Previous
                </Button>
                <p>
                  Page <span className="font-semibold text-foreground dark:text-foreground-inverse">{page + 1}</span> of <span className="font-semibold text-foreground dark:text-foreground-inverse">{pageInfo.totalPages}</span>
                  <span className="ml-2 text-foreground-soft dark:text-foreground-inverse-muted">({pageInfo.totalElements} events)</span>
                </p>
                <Button type="button" variant="secondary" onClick={() => setPage((current) => current + 1)} disabled={pageInfo.last || loading}>
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
