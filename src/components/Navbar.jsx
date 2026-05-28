import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600" onClick={handleLinkClick}>
          Camp<span className="text-green-400">Gear</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="hover:text-green-600 transition">Produk</Link>
          
          {user ? (
            <>
              <Link to="/bookings" className="hover:text-green-600 transition">Pesanan Saya</Link>
              <Link to="/wishlist" className="hover:text-green-600 transition">Wishlist</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition">
                Logout
              </button>
              <span className="text-gray-600">Halo, {user.name?.split(' ')[0]}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-600 transition">Login</Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 flex flex-col gap-3">
          <Link to="/products" className="py-2 hover:text-green-600 transition" onClick={handleLinkClick}>
            Produk
          </Link>
          
          {user ? (
            <>
              <Link to="/bookings" className="py-2 hover:text-green-600 transition" onClick={handleLinkClick}>
                Pesanan Saya
              </Link>
              <Link to="/wishlist" className="py-2 hover:text-green-600 transition" onClick={handleLinkClick}>
                Wishlist
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="py-2 bg-green-600 text-white text-center rounded-lg" onClick={handleLinkClick}>
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="py-2 text-red-500 text-left">
                Logout
              </button>
              <div className="pt-2 text-gray-600">Halo, {user.name}</div>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 hover:text-green-600 transition" onClick={handleLinkClick}>
                Login
              </Link>
              <Link to="/register" className="py-2 bg-green-600 text-white text-center rounded-lg" onClick={handleLinkClick}>
                Daftar
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;