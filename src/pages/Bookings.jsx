import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
// eslint-disable-next-line no-unused-vars
import SkeletonCard from '../components/SkeletonCard';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Gagal mengambil booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const textMap = {
      pending: 'Menunggu Pembayaran',
      paid: 'Dibayar',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {textMap[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Pesanan Saya</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-gray-50 rounded-lg p-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg">Belum ada pesanan.</p>
          <Link to="/products" className="inline-block mt-4 text-green-600 hover:underline">
            Lihat Produk →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Pesanan Saya</h1>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            {/* Header dengan status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b bg-gray-50">
              <div>
                <p className="text-sm text-gray-500">Booking #{booking.booking_number}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(booking.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            {/* Daftar item yang dipesan */}
            <div className="p-4 space-y-3">
              {booking.items?.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b last:border-0">
                  <div className="flex gap-3 flex-1">
                    {/* Thumbnail kecil */}
                    <img
                      src={item.product?.thumbnail || 'https://placehold.co/60x60/2E7D32/white?text=CampGear'}
                      alt={item.product_name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x Rp {item.price_per_day?.toLocaleString()} /hari
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      Rp {item.subtotal?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {Math.ceil((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24))} hari
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer dengan total */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gray-50 border-t">
              <div className="flex gap-4 text-sm text-gray-600">
                <span>📅 {new Date(booking.start_date).toLocaleDateString('id-ID')}</span>
                <span>→</span>
                <span>{new Date(booking.end_date).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
                <div className="text-right sm:text-left">
                  <p className="text-xs text-gray-500">Total Pembayaran</p>
                  <p className="font-bold text-lg text-green-600">
                    Rp {booking.total_price?.toLocaleString()}
                  </p>
                </div>
                <Link
                  to={`/bookings/${booking.id}`}
                  className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                >
                  Lihat Detail
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;