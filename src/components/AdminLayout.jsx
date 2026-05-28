import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-green-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/admin" className="text-xl font-bold text-green-600">
              Admin Panel
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Halo, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 space-y-2">
            <Link
              to="/admin"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Produk
            </Link>
            <Link
              to="/admin/bookings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Pesanan
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;