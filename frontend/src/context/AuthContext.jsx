import { useMemo, useState } from 'react';
import { login as loginRequest } from '../api/authService';
import AuthContext from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hlab_user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, password) {
    const { token, user: loggedUser } = await loginRequest(email, password);
    localStorage.setItem('hlab_token', token);
    localStorage.setItem('hlab_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  }

  function logout() {
    localStorage.removeItem('hlab_token');
    localStorage.removeItem('hlab_user');
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
