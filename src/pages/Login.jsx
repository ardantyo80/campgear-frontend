import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(email, password);
      
      if (response.success) {
        navigate('/');
      } else {
        // Ambil pesan error dari response
        let errorMessage = response.error || 'Email atau password salah';
        
        // Jika error dari validasi Laravel (422)
        if (response.errors) {
          if (response.errors.email) {
            errorMessage = response.errors.email[0];
          } else if (response.errors.password) {
            errorMessage = response.errors.password[0];
          }
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Tangkap error dari Axios
      let errorMessage = 'Email atau password salah';
      
      if (err.response?.status === 422) {
        // Validasi error dari Laravel
        const errors = err.response.data?.errors;
        if (errors) {
          if (errors.email) {
            errorMessage = errors.email[0];
          } else if (errors.password) {
            errorMessage = errors.password[0];
          } else {
            errorMessage = err.response.data?.message || 'Email atau password salah';
          }
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
        <h1 className="text-2xl font-bold text-center mb-6 text-green-600">Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password (minimal 6 karakter)"
            className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          Belum punya akun? <Link to="/register" className="text-green-600 hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;