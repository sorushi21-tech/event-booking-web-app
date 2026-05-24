import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(values);
      setSuccess('Account created successfully');
      navigate('/events', { state: { message: 'Account created successfully' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create Account"
      submitLabel="Register"
      fields={[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password', minLength: 6, maxLength: 72 }
      ]}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      success={success}
      loading={loading}
      footerText="Already registered?"
      footerLink="/login"
      footerLinkText="Login"
    />
  );
}
