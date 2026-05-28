import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Toast from '../components/Toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${slug}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Gagal mengambil detail produk:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Hitung total hari otomatis
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotalDays(days > 0 ? days : 0);
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/wishlist/${product.id}`);
      setToast({ message: '✓ Ditambahkan ke wishlist!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Gagal menambahkan ke wishlist', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      setError('Pilih tanggal sewa terlebih dahulu');
      return;
    }

    if (totalDays < 1) {
      setError('Minimal sewa 1 hari');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const response = await api.post('/bookings', {
        items: [{ product_id: product.id, quantity }],
        start_date: startDate,
        end_date: endDate,
        notes: ''
      });

      const bookingId = response.data.booking.id;
      navigate(`/payment/${bookingId}`);
      
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.error || 'Gagal membuat booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 animate-pulse">
          {/* Image skeleton */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Produk tidak ditemukan</p>
        <button 
          onClick={() => navigate('/products')} 
          className="inline-block mt-4 text-green-600 hover:underline"
        >
          Kembali ke Produk
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const totalPrice = product.price_per_day * quantity * totalDays;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Gambar - Responsif */}
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-24 h-fit">
          <img
            src={product.thumbnail || 'https://placehold.co/600x400/2E7D32/white?text=CampGear'}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        {/* Info Produk - Responsif */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category?.name}</p>
          
          <p className="text-green-600 font-bold text-2xl md:text-3xl mb-4">
            Rp {product.price_per_day?.toLocaleString() || 0} 
            <span className="text-sm text-gray-500">/hari</span>
          </p>

          {product.stock_limited && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4">
              ⚠️ Stok terbatas! Segera booking.
            </div>
          )}

          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          {/* Form Booking - Responsif */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-lg mb-3">Form Pemesanan</h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Jumlah</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                >
                  +
                </button>
                <span className="text-gray-500 text-sm">Stok: {product.stock}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Tanggal Mulai Sewa</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Tanggal Selesai Sewa</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Total Hari & Biaya */}
            {totalDays > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700">
                  📅 <span className="font-semibold">{totalDays}</span> hari sewa
                </p>
                <p className="text-green-700 text-lg font-bold mt-1">
                  Total: Rp {totalPrice.toLocaleString()}
                </p>
              </div>
            )}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Tombol - Responsif (stack di mobile) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Booking Sekarang'
                )}
              </button>
              <button
                onClick={handleAddToWishlist}
                className="sm:flex-1 border border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition"
              >
                ❤️ Wishlist
              </button>
            </div>

            {/* Informasi tambahan */}
            <div className="mt-6 pt-4 border-t text-sm text-gray-500">
              <p>✅ Booking dapat dibatalkan sebelum melakukan pembayaran</p>
              <p>✅ Konfirmasi booking akan dikirim via WhatsApp</p>
              <p>✅ Pembayaran aman melalui Midtrans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;