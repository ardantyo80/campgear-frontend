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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Booking tidak ditemukan</p>
        <Link to="/bookings" className="inline-block mt-4 text-green-600 hover:underline">
          Kembali
        </Link>
      </div>
    );
  }

  const totalDays = Math.ceil(
    (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)
  );

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Menunggu Pembayaran',
      paid: 'Sudah Dibayar',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Tombol Print */}
      <div className="flex justify-end mb-4 no-print">
        <button
          onClick={handlePrint}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Cetak Tiket
        </button>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden print:shadow-none" id="invoice">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 print:bg-green-600">
          <div className="text-center">
            <h1 className="text-2xl font-bold">CampGear</h1>
            <p className="text-sm opacity-90">Rental Alat Camping</p>
          </div>
        </div>

        {/* Title */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-center">INVOICE PEMESANAN</h2>
          <p className="text-center text-gray-500 text-sm mt-1">Booking #{booking.booking_number}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status */}
          <div className="mb-6 flex justify-between items-center">
            <span className="text-gray-600">Status Pesanan:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Informasi Pelanggan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-sm">Nama</p>
                <p className="font-medium">{booking.user?.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{booking.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Telepon</p>
                <p className="font-medium">{booking.user?.phone || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tanggal Booking</p>
                <p className="font-medium">{new Date(booking.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Periode Sewa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-gray-500 text-sm">Tanggal Mulai</p>
                <p className="font-medium">{new Date(booking.start_date).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tanggal Selesai</p>
                <p className="font-medium">{new Date(booking.end_date).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Durasi</p>
                <p className="font-medium">{totalDays} hari</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Detail Pemesanan</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3 text-sm font-semibold">Produk</th>
                  <th className="text-center py-2 px-3 text-sm font-semibold">Qty</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold">Harga/hari</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {booking.items?.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-3">{item.product_name}</td>
                    <td className="text-center py-2 px-3">{item.quantity}</td>
                    <td className="text-right py-2 px-3">Rp {item.price_per_day?.toLocaleString()}</td>
                    <td className="text-right py-2 px-3">Rp {item.subtotal?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td colSpan="3" className="text-right py-3 px-3 font-semibold">Total</td>
                  <td className="text-right py-3 px-3 font-bold text-green-600">
                    Rp {booking.total_price?.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Catatan */}
          {booking.notes && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Catatan:</p>
              <p className="text-sm">{booking.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-center text-gray-400 text-xs">
            <p>Terima kasih telah menggunakan layanan CampGear</p>
            <p>Hubungi kami: +62 812-3456-7890 | campgear@example.com</p>
            <p className="mt-1">*Simpan invoice ini sebagai bukti pemesanan</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 no-print">
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
              className="flex-1 border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-500 hover:text-white transition"
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
  );
};

export default BookingDetail;