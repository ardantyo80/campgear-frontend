import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../api/axios';

const PaymentSuccess = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      startVelocity: 15,
      colors: ['#2E7D32', '#4CAF50', '#81C784']
    });
    
    // Tambahan confetti setelah 0.5 detik
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5 },
        startVelocity: 20
      });
    }, 500);
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error('Gagal mengambil booking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="bg-green-100 text-green-800 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 animate-bounce">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Pembayaran Berhasil! 🎉</h1>
      <p className="text-gray-600 mb-6">
        Booking #{booking?.booking_number} telah berhasil dibayar.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-semibold mb-3">Detail Pesanan:</h3>
        <p className="text-gray-600 mb-2">
          Tanggal Sewa: {booking?.start_date && new Date(booking.start_date).toLocaleDateString('id-ID')} - {booking?.end_date && new Date(booking.end_date).toLocaleDateString('id-ID')}
        </p>
        <p className="text-gray-600">
          Total: Rp {booking?.total_price?.toLocaleString() || 0}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/bookings" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
          Lihat Pesanan Saya
        </Link>
        <Link to="/products" className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition">
          Lanjut Sewa
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;