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
    if (form.password !== form.password_confirmation) {
      setError('Password tidak cocok');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Gagal mendaftar, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-600">Daftar</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
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