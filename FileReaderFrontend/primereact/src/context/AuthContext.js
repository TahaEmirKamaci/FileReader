import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || '');
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');
    return username ? { id: localStorage.getItem('userId'), username, role } : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const login = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('jwtToken', tokenData);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userRole', userData.role);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  };

  const value = {
    token,
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
