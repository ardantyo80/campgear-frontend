import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const url = filter === 'all' ? '/admin/bookings' : `/admin/bookings?status=${filter}`;
      const response = await api.get(url);
      setBookings(response.data);
    } catch (error) {
      console.error('Gagal mengambil booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error('Gagal update status:', error);
      alert('Gagal update status');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'Menunggu Bayar',
      paid: 'Dibayar',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return <span className={`px-2 py-1 rounded text-xs ${colors[status]}`}>{labels[status]}</span>;
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kelola Pesanan</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'paid', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg transition ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-3 text-sm">#{booking.booking_number?.slice(-8)}</td>
                <td className="px-4 py-3">{booking.user?.name}</td>
                <td className="px-4 py-3 text-sm">{new Date(booking.created_at).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-3">Rp {booking.total_price?.toLocaleString()}</td>
                <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                <td className="px-4 py-3">
                  <select onChange={(e) => updateStatus(booking.id, e.target.value)} value={booking.status} className="text-sm border rounded p-1">
                    <option value="pending">Menunggu Bayar</option>
                    <option value="paid">Dibayar</option>
                    <option value="confirmed">Dikonfirmasi</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;