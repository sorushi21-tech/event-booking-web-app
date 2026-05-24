import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getEventById, updateAdminEvent } from '../api/eventApi';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Loader from '../components/ui/Loader.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const defaultForm = {
  title: '',
  description: '',
  location: '',
  eventDate: '',
  category: '',
  status: 'ACTIVE',
  totalSeats: 1,
  ticketPrice: 1,
  imageUrl: ''
};

const toDateTimeLocalValue = (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

export default function AdminEditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    setLoading(true);
    setError('');
    getEventById(id)
      .then(({ data }) => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          eventDate: toDateTimeLocalValue(data.eventDate),
          category: data.category || 'General',
          status: data.status || 'ACTIVE',
          totalSeats: data.totalSeats || 1,
          ticketPrice: data.ticketPrice || 1,
          imageUrl: data.imageUrl || ''
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load event'))
      .finally(() => setLoading(false));
  }, [id, isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/events" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: ['totalSeats', 'ticketPrice'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await updateAdminEvent(id, form);
      setMessage('Event updated successfully');
      navigate(`/events/${id}`, { state: { message: 'Event updated successfully' } });
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      const firstValidationMessage = validationErrors ? Object.values(validationErrors)[0] : '';
      setError(firstValidationMessage || err.response?.data?.message || 'Unable to update event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Loader label="Loading event editor..." />
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <Toast message={message || error} variant={error ? 'danger' : 'success'} onClose={() => { setMessage(''); setError(''); }} />

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground dark:text-foreground-inverse">Edit event</h1>
          <p className="mt-2 text-sm text-foreground-muted dark:text-foreground-inverse-muted">Update event details, capacity, pricing, and visibility.</p>
        </div>
        <Link to={`/events/${id}`} className="text-sm font-semibold text-foreground transition hover:text-foreground dark:text-foreground-inverse-muted dark:hover:text-foreground-inverse">
          Back to event
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <Input label="Title" name="title" value={form.title} onChange={handleChange} maxLength="120" required />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} maxLength="160" required />
          <Input label="Category" name="category" value={form.category} onChange={handleChange} maxLength="80" required />
          <Input label="Date & time" name="eventDate" type="datetime-local" value={form.eventDate} onChange={handleChange} required />
          <Input label="Total seats" name="totalSeats" type="number" min="1" value={form.totalSeats} onChange={handleChange} required />
          <Input label="Ticket price" name="ticketPrice" type="number" min="0.01" step="0.01" value={form.ticketPrice} onChange={handleChange} required />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground-soft dark:text-foreground-inverse-muted">Status</span>
            <select name="status" value={form.status} onChange={handleChange} className="form-input" required>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <Input label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} maxLength="500" placeholder="https://example.com/event.jpg" />

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground-soft dark:text-foreground-inverse-muted">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength="1000"
              className="form-input min-h-[160px] resize-none"
              required
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(`/events/${id}`)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
