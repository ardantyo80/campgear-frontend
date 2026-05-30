import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user saat token ada
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (error) {
        console.error('Gagal mengambil user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

 // Login
const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    setUser(user);
    
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    
    // Kirim detail error dari backend
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login gagal',
      errors: error.response?.data?.errors || null
    };
  }
};

// Register
const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    setUser(user);
    
    return { success: true, user };
  } catch (error) {
    console.error('Register error:', error);
    
    return { 
      success: false, 
      error: error.response?.data?.message || 'Registrasi gagal',
      errors: error.response?.data?.errors || null
    };
  }
};

  // Logout
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Update user profile (opsional)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};