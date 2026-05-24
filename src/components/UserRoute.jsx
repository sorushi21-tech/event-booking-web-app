import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserRoute() {
  const { isUser } = useAuth();

  return isUser ? <Outlet /> : <Navigate to="/forbidden" replace />;
}
