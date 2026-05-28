import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const cards = [
    { title: 'Total Produk', value: stats?.total_products || 0, icon: '📦', color: 'bg-blue-500' },
    { title: 'Total Booking', value: stats?.total_bookings || 0, icon: '📋', color: 'bg-green-500' },
    { title: 'Booking Pending', value: stats?.pending_bookings || 0, icon: '⏳', color: 'bg-yellow-500' },
    { title: 'Total Pendapatan', value: `Rp ${(stats?.total_revenue || 0).toLocaleString()}`, icon: '💰', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} text-white text-2xl p-4 rounded-full`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart sederhana */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-semibold text-lg mb-4">Statistik Booking (7 Hari Terakhir)</h2>
        <div className="flex items-end gap-2 h-48">
          {stats?.chart_data?.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-green-500 rounded-t"
                style={{ height: `${(item.count / 10) * 100}px`, maxHeight: '180px' }}
              ></div>
              <span className="text-xs mt-2 text-gray-500">{item.date.slice(5)}</span>
              <span className="text-xs font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;