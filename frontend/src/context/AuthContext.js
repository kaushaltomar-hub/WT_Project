import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = axios.create({ baseURL: '/api' });

// Intercept to add token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ayur_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ayur_token');
    const userData = localStorage.getItem('ayur_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('ayur_token', data.token);
    localStorage.setItem('ayur_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, age, gender) => {
    const { data } = await API.post('/auth/register', { name, email, password, age, gender });
    localStorage.setItem('ayur_token', data.token);
    localStorage.setItem('ayur_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ayur_token');
    localStorage.removeItem('ayur_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ayur_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API };
