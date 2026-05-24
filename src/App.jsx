import { Navigate, Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserRoute from './components/UserRoute.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import AdminEventBookingsPage from './pages/AdminEventBookingsPage.jsx';
import AdminEditEventPage from './pages/AdminEditEventPage.jsx';
import ForbiddenPage from './pages/ForbiddenPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/events/:id/edit" element={<AdminEditEventPage />} />
            <Route path="/events/:id/bookings" element={<AdminEventBookingsPage />} />
          </Route>
          <Route element={<UserRoute />}>
            <Route path="/bookings" element={<BookingsPage />} />
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
