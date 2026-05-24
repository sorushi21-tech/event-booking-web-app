import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/authApi';
import { setUnauthorizedHandler } from '../api/http';

const AuthContext = createContext(null);

const parseJwtPayload = (jwt) => {
  try {
    const payload = jwt.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(normalized));
  } catch {
    return null;
  }
};

const isTokenExpired = (jwt) => {
  const payload = parseJwtPayload(jwt);
  if (!payload?.exp) {
    return false;
  }
  return payload.exp * 1000 <= Date.now();
};

const getStoredUser = () => {
  const stored = localStorage.getItem('user');
  try {
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenExpired(storedToken)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return storedToken;
  });
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenExpired(storedToken)) {
      return null;
    }
    return getStoredUser();
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(logout);

    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const payload = parseJwtPayload(token);
    if (!payload?.exp) {
      return undefined;
    }

    const delay = payload.exp * 1000 - Date.now();
    if (delay <= 0) {
      logout();
      return undefined;
    }

    const timeoutId = window.setTimeout(logout, delay);
    return () => window.clearTimeout(timeoutId);
  }, [token]);

  const login = async (payload) => {
    const { data } = await loginRequest(payload);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    await registerRequest(payload);
    return login({ email: payload.email, password: payload.password });
  };

  const updateUser = (nextUser) => {
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const role = user?.role || '';
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      isAdmin,
      isUser,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateUser
    }),
    [token, user, role, isAdmin, isUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
