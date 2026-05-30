import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    
    if (form.password !== form.password_confirmation) {
      setError('Password tidak cocok');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await register(form);
      
      if (response.success) {
        navigate('/');
      } else {
        let errorMessage = response.error || 'Gagal mendaftar';
        
        if (response.errors?.email) {
          errorMessage = response.errors.email[0];
          if (errorMessage.includes('already been taken')) {
            errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login.';
          }
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Register error:', err);
      
      let errorMessage = 'Gagal mendaftar. Silakan coba lagi.';
      
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        if (errors?.email) {
          errorMessage = errors.email[0];
          if (errorMessage.includes('already been taken')) {
            errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login.';
          }
        } else if (errors?.password) {
          errorMessage = errors.password[0];
        } else if (errors?.name) {
          errorMessage = errors.name[0];
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-600">Daftar</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          
          <input
            type="password"
            placeholder="Password (minimal 6 karakter)"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength="6"
            required
          />
          
          <input
            type="password"
            placeholder="Konfirmasi Password"
            className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          Sudah punya akun? <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;