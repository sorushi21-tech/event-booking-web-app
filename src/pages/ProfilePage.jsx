import { useEffect, useState } from 'react';
import { changePassword, getProfile, updateProfile } from '../api/authApi';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Loader from '../components/ui/Loader.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const loadProfile = () => {
    setLoading(true);
    setError('');
    return getProfile()
      .then(({ data }) => {
        setProfile(data);
        setName(data.name || '');
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load profile'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { data } = await updateProfile({ name });
      setProfile(data);
      setName(data.name || '');
      updateUser(data);
      setMessage('Profile updated successfully');
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      const firstValidationMessage = validationErrors ? Object.values(validationErrors)[0] : '';
      setError(firstValidationMessage || err.response?.data?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setChangingPassword(true);
    setError('');
    setMessage('');

    try {
      const { data } = await changePassword(passwordForm);
      resetPasswordForm();
      setMessage(data.message || 'Password changed successfully');
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      const firstValidationMessage = validationErrors ? Object.values(validationErrors)[0] : '';
      setError(firstValidationMessage || err.response?.data?.message || 'Unable to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Loader label="Loading your profile..." />
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <Toast message={message || error} variant={error ? 'danger' : 'success'} onClose={() => { setMessage(''); setError(''); }} />

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground dark:text-foreground-inverse">My profile</h1>
        <p className="mt-2 text-sm text-foreground-muted dark:text-foreground-inverse-muted">Keep your display name current while your email and role stay protected.</p>
      </div>

      {error && !profile ? (
        <Card className="bg-danger-50 text-danger-900">
          <p className="text-sm">{error}</p>
          <Button type="button" className="mt-4" onClick={loadProfile}>Retry</Button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div className="space-y-6">
            <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Name" name="name" value={name} onChange={(event) => setName(event.target.value)} maxLength="120" required />
              <Input label="Email" name="email" value={profile?.email || ''} readOnly disabled />
              <Input label="Role" name="role" value={profile?.role || ''} readOnly disabled />
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save profile'}
              </Button>
            </form>
            </Card>

            <Card>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-foreground dark:text-foreground-inverse">Security</h2>
                </div>
                <Input
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  maxLength="72"
                  required
                />
                <Input
                  label="New password"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  minLength="8"
                  maxLength="72"
                  required
                />
                <Input
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  maxLength="72"
                  required
                />
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword ? 'Changing...' : 'Change password'}
                </Button>
              </form>
            </Card>
          </div>

          <Card className="space-y-4 bg-surface-soft dark:bg-surface-dark/80">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-dark text-xl font-semibold text-foreground-inverse dark:bg-surface-soft dark:text-foreground">
              {(profile?.name || 'U')
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground dark:text-foreground-inverse">{profile?.name}</h2>
              <p className="mt-1 text-sm text-foreground-muted dark:text-foreground-inverse-muted">{profile?.email}</p>
            </div>
            <p className="inline-flex w-fit rounded-2xl bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground-soft dark:bg-surface-dark dark:text-foreground-inverse-muted">
              {profile?.role}
            </p>
          </Card>
        </div>
      )}
    </section>
  );
}
