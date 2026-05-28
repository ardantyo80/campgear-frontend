import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error('Gagal mengambil detail booking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      alert('Pesanan dibatalkan');
      navigate('/bookings');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Gagal membatalkan pesanan');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!booking) {
    return <div className="text-center py-20">Booking tidak ditemukan</div>;
  }

  const totalDays = Math.ceil(
    (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Detail Pesanan</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <p className="text-gray-600 mb-2">Booking #{booking.booking_number}</p>
          <p className="text-gray-600 mb-2">
            {new Date(booking.start_date).toLocaleDateString('id-ID')} - {new Date(booking.end_date).toLocaleDateString('id-ID')}
          </p>
          <p className="text-gray-600">({totalDays} hari)</p>
        </div>

        <div className="p-6 border-b">
          <h3 className="font-semibold mb-3">Item</h3>
          {booking.items?.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <span>{item.product_name} x{item.quantity}</span>
              <span>Rp {item.subtotal?.toLocaleString() || 0}</span>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-2xl text-green-600">
              Rp {booking.total_price?.toLocaleString() || 0}
            </span>
          </div>

          <div className="mb-4">
            <span className="text-sm text-gray-500">Status: </span>
            <span className={`px-2 py-1 rounded text-xs ${
              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              booking.status === 'paid' ? 'bg-blue-100 text-blue-800' :
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.status === 'pending' ? 'Menunggu Pembayaran' :
               booking.status === 'paid' ? 'Sudah Dibayar' :
               booking.status === 'confirmed' ? 'Dikonfirmasi' :
               booking.status}
            </span>
          </div>

          <div className="flex gap-4">
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={() => navigate(`/payment/${booking.id}`)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Bayar Sekarang
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-500 hover:text-white transition"
                >
                  Batalkan
                </button>
              </>
            )}
            <Link
              to="/bookings"
              className="flex-1 text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Kembali
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;