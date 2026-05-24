import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getAdminEventBookings } from '../api/bookingApi';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminEventBookingsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [totalBookings, setTotalBookings] = useState(0);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 0, first: true, last: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  const loadBookings = () => {
    setLoading(true);
    setError('');
    return getAdminEventBookings(id, { page, size: 10 })
      .then(({ data }) => {
        setEventTitle(data.eventTitle || '');
        setTotalBookings(data.totalBookings || 0);
        setBookings(data.bookings || []);
        setPageInfo({
          totalPages: data.totalPages || 0,
          first: data.first ?? true,
          last: data.last ?? true
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load event bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAdmin) {
      loadBookings();
    }
  }, [id, page, isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/events" replace />;
  }

  return (
    <section className="space-y-6">
      <Toast message={error} variant="danger" onClose={() => setError('')} />

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground dark:text-foreground-inverse">
            Event bookings
          </h1>
          <p className="mt-2 text-sm text-foreground-muted dark:text-foreground-inverse-muted">
            {eventTitle || 'Review ticket bookings for this event.'}
          </p>
        </div>
        <Link to={`/events/${id}`} className="text-sm font-semibold text-foreground transition hover:text-foreground dark:text-foreground-inverse-muted dark:hover:text-foreground-inverse">
          Back to event
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-surface-soft p-4 dark:bg-surface-dark/80">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground-soft dark:text-foreground-inverse-muted">Total bookings</p>
          <p className="mt-2 text-2xl font-semibold text-foreground dark:text-foreground-inverse">{totalBookings}</p>
        </Card>
        <Card className="bg-surface-soft p-4 dark:bg-surface-dark/80">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground-soft dark:text-foreground-inverse-muted">Confirmed</p>
          <p className="mt-2 text-2xl font-semibold text-foreground dark:text-foreground-inverse">{bookings.filter((item) => item.status === 'CONFIRMED').length}</p>
        </Card>
        <Card className="bg-surface-soft p-4 dark:bg-surface-dark/80">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground-soft dark:text-foreground-inverse-muted">Cancelled</p>
          <p className="mt-2 text-2xl font-semibold text-foreground dark:text-foreground-inverse">{bookings.filter((item) => item.status === 'CANCELLED').length}</p>
        </Card>
      </div>

      {loading ? (
        <Card>
          <Loader label="Loading event bookings..." />
        </Card>
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings found" description="This event does not have any ticket bookings yet." action={<Button type="button" onClick={loadBookings}>Refresh</Button>} />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-border text-sm dark:divide-border-dark">
            <thead className="bg-surface-soft text-left text-xs uppercase tracking-[0.2em] text-foreground-soft dark:bg-surface-dark/80 dark:text-foreground-inverse-muted">
              <tr>
                <th className="px-5 py-4 font-semibold">User</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Tickets</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Booked at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border-dark">
              {bookings.map((booking) => (
                <tr key={booking.bookingId} className="align-top">
                  <td className="px-5 py-4 font-semibold text-foreground dark:text-foreground-inverse">{booking.userName}</td>
                  <td className="px-5 py-4 text-foreground-muted dark:text-foreground-inverse-muted">{booking.userEmail}</td>
                  <td className="px-5 py-4 text-foreground-muted dark:text-foreground-inverse-muted">{booking.ticketCount}</td>
                  <td className="px-5 py-4">
                    <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'danger'}>{booking.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-foreground-muted dark:text-foreground-inverse-muted">{new Date(booking.bookedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

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
    </section>
  );
}
