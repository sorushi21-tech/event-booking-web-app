import { useEffect, useState } from 'react';
import { cancelBooking, getMyBookings } from '../api/bookingApi';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Toast from '../components/ui/Toast.jsx';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0, first: true, last: true });
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadBookings = () => {
    setLoading(true);
    setError('');
    return getMyBookings({ page, size: 10 })
      .then(({ data }) => {
        setBookings(data.content || []);
        setPageInfo({
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0,
          first: data.first ?? true,
          last: data.last ?? true
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, [page]);

  const handleCancel = async (booking) => {
    const confirmed = window.confirm(`Cancel booking for ${booking.eventTitle}?`);
    if (!confirmed) {
      return;
    }

    setError('');
    setMessage('');
    setCancellingId(booking.id);

    try {
      await cancelBooking(booking.id);
      setMessage('Booking cancelled');
      await loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to cancel booking');
    } finally {
      setCancellingId('');
    }
  };

  return (
    <section className="space-y-6">
      <Toast message={message || error} variant={error ? 'danger' : 'success'} onClose={() => { setMessage(''); setError(''); }} />

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Bookings</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground dark:text-foreground-inverse">My bookings</h1>
          <p className="mt-2 text-sm text-foreground-muted dark:text-foreground-inverse-muted">Track your past bookings and manage cancellations comfortably.</p>
        </div>
        <div className="grid gap-3 sm:auto-cols-fr sm:grid-flow-col">
          <Card className="bg-surface-soft p-4 dark:bg-surface-dark/80">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground-soft dark:text-foreground-inverse-muted">Total</p>
            <p className="mt-2 text-2xl font-semibold text-foreground dark:text-foreground-inverse">{pageInfo.totalElements}</p>
          </Card>
          <Card className="bg-surface-soft p-4 dark:bg-surface-dark/80">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground-soft dark:text-foreground-inverse-muted">Confirmed</p>
            <p className="mt-2 text-2xl font-semibold text-foreground dark:text-foreground-inverse">{bookings.filter((item) => item.status === 'CONFIRMED').length}</p>
          </Card>
        </div>
      </div>

      {loading ? (
        <Card>
          <Loader label="Loading your bookings..." />
        </Card>
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Book an event to start seeing your bookings here." action={<Button type="button" onClick={loadBookings}>Refresh</Button>} />
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <Card key={booking.id} className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground dark:text-foreground-inverse">{booking.eventTitle}</h2>
                  <p className="mt-1 text-sm text-foreground-muted dark:text-foreground-inverse-muted">{new Date(booking.eventDate).toLocaleString()}</p>
                  <p className="mt-2 text-sm text-foreground-soft dark:text-foreground-inverse-muted">Booked on {new Date(booking.bookedAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'danger'}>{booking.status}</Badge>
                  {booking.status === 'CONFIRMED' && (
                    <Button type="button" variant="danger" size="sm" onClick={() => handleCancel(booking)} disabled={cancellingId === booking.id}>
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {pageInfo.totalPages > 1 && (
            <div className="flex flex-col gap-3 rounded-[2rem] border border-border bg-surface-soft p-5 text-sm text-foreground-muted shadow-sm dark:border-border-dark dark:bg-surface-dark/80 dark:text-foreground-inverse-muted sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="secondary" onClick={() => setPage((current) => Math.max(current - 1, 0))} disabled={pageInfo.first || loading}>
                Previous
              </Button>
              <p>
                Page <span className="font-semibold text-foreground dark:text-foreground-inverse">{page + 1}</span> of <span className="font-semibold text-foreground dark:text-foreground-inverse">{pageInfo.totalPages}</span>
              </p>
              <Button type="button" variant="secondary" onClick={() => setPage((current) => current + 1)} disabled={pageInfo.last || loading}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
