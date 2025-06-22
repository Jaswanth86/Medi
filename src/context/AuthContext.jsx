import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole')); // Store user's role
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to initialize user and role from local storage
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: decodedToken.id, username: decodedToken.username });
        // The decodedToken should ideally also contain the role if backend provides it
        // For now, we rely on userRole from localStorage if not present in token
        if (decodedToken.role && decodedToken.role !== userRole) {
          setUserRole(decodedToken.role);
          localStorage.setItem('userRole', decodedToken.role);
        } else if (!decodedToken.role && !userRole) {
          // If token doesn't have role, and no role in localStorage, default to 'patient'
          // This ensures old tokens without role info still work as patients
          setUserRole('patient');
          localStorage.setItem('userRole', 'patient');
        }
      } catch (e) {
        console.error('Failed to decode token or token invalid:', e);
        // Clear invalid token/role
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setToken(null);
        setUser(null);
        setUserRole(null);
      }
    }
    setLoading(false);
  }, [token, userRole]); // Depend on userRole to react if it changes externally

  const login = async (username, password, role) => { // Added role parameter
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      const { token: newToken, user: userData, role: backendRole } = response.data; // Destructure role from backend

      // Prioritize backend-provided role, otherwise use the role from the form, default to patient
      const actualRole = backendRole || role || 'patient';

      localStorage.setItem('token', newToken);
      localStorage.setItem('userRole', actualRole); // Store the selected/determined role
      setToken(newToken);
      setUser(userData);
      setUserRole(actualRole); // Set role in state
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Redirect based on role
      if (actualRole === 'patient') {
        navigate('/dashboard');
      } else if (actualRole === 'caretaker') {
        navigate('/caretaker-dashboard');
      } else {
        navigate('/dashboard'); // Fallback
      }
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setToken(null);
      setUser(null);
      setUserRole(null);
      return { success: false, message: error.response?.data?.message || 'Login failed.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, role) => { // Added role parameter
    try {
      setLoading(true);
      // Backend registration should also ideally save the role
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { username, password, role }); // Pass role to backend
      // After successful registration, automatically log them in with the specified role
      const actualRole = role || 'patient'; // Default to 'patient' if role not provided
      // Use the new login function with role (which will now correctly handle the actualRole)
      await login(username, password, actualRole);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: error.response?.data?.message || 'Registration failed.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); // Clear role on logout
    setToken(null);
    setUser(null);
    setUserRole(null); // Clear role from state
    delete axios.defaults.headers.common['Authorization'];
    navigate('/'); // Redirect to landing page on logout
  };

  const value = {
    user,
    token,
    userRole, // Expose userRole
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};