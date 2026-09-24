import { createContext, useContext, useState } from 'react';
import api from './api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const authenticate = async (path, body) => {
    const { data } = await api.post(`/auth/${path}`, body);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (body) => authenticate('login', body),
        register: (body) => authenticate('register', body),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
