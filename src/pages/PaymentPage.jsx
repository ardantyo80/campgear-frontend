import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error('Gagal mengambil booking:', error);
        setError('Data booking tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  // Fungsi untuk update status booking setelah payment sukses
  const updateBookingStatus = async (orderId, transactionId, paymentType) => {
    try {
      // Extract booking number dari order_id (hilangkan timestamp)
      const parts = orderId.split('-');
      let bookingNumber;
      if (parts.length >= 3) {
        bookingNumber = parts[0] + '-' + parts[1] + '-' + parts[2];
      } else {
        bookingNumber = orderId;
      }
      
      await api.post('/bookings/update-status', {
        booking_number: bookingNumber,
        transaction_id: transactionId,
        payment_type: paymentType
      });
      console.log('Booking status updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update booking status:', error);
      return false;
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await api.post(`/bookings/${id}/pay`);
      const { snap_token } = response.data;

      const options = {
        onSuccess: async (result) => {
          console.log('Payment success:', result);
          
          // Update status booking via API
          await updateBookingStatus(
            result.order_id,
            result.transaction_id,
            result.payment_type
          );
          
          // Redirect ke halaman sukses
          navigate(`/payment/success/${id}`);
        },
        onPending: (result) => {
          console.log('Payment pending:', result);
          navigate(`/payment/pending/${id}`);
        },
        onError: (result) => {
          console.log('Payment error:', result);
          setError('Pembayaran gagal, silakan coba lagi');
          setProcessing(false);
        },
        onClose: () => {
          console.log('Payment popup closed');
          setProcessing(false);
        }
      };

      if (window.snap) {
        window.snap.pay(snap_token, options);
      } else {
        setError('Payment system not loaded, please refresh the page');
        setProcessing(false);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.error || 'Gagal memproses pembayaran');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || 'Booking tidak ditemukan'}</p>
        <button 
          onClick={() => navigate('/bookings')} 
          className="inline-block mt-4 text-green-600 hover:underline"
        >
          Kembali ke Pesanan Saya
        </button>
      </div>
    );
  }

  const totalDays = Math.ceil(
    (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Pembayaran</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-lg mb-4">Detail Pesanan</h2>
          <p className="text-gray-600 mb-2">Booking #{booking.booking_number}</p>
          <p className="text-gray-600 mb-2">
            {new Date(booking.start_date).toLocaleDateString('id-ID')} - {new Date(booking.end_date).toLocaleDateString('id-ID')}
          </p>
          <p className="text-gray-600">({totalDays} hari)</p>
        </div>

        <div className="p-6 border-b">
          <h3 className="font-semibold mb-3">Item yang disewa</h3>
          {booking.items?.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <span>{item.product_name} x{item.quantity}</span>
              <span>Rp {item.subtotal?.toLocaleString() || 0}</span>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total Pembayaran:</span>
            <span className="font-bold text-2xl text-green-600">
              Rp {booking.total_price?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        <div className="p-6">
          {booking.payment_status === 'paid' ? (
            <div className="text-center text-green-600">
              ✓ Pembayaran sudah lunas
            </div>
          ) : (
            <>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {processing ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Pembayaran aman melalui Midtrans (Kartu Kredit, Bank Transfer, QRIS, Indomaret)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;