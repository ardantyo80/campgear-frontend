/* eslint-disable no-unused-vars */
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Wishlist from './pages/Wishlist';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentPending from './pages/PaymentPending';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminBookings from './pages/Admin/AdminBookings';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <HashRouter> 
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes (Customer) */}
              <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
              <Route path="/bookings/:id" element={<PrivateRoute><BookingDetail /></PrivateRoute>} />
              <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
              <Route path="/payment/:id" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
              <Route path="/payment/success/:id" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
              <Route path="/payment/pending/:id" element={<PrivateRoute><PaymentPending /></PrivateRoute>} />
              
              {/* Admin Routes (Nested Layout) */}
              <Route path="/admin" element={<PrivateRoute adminOnly><AdminLayout /></PrivateRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="bookings" element={<AdminBookings />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;