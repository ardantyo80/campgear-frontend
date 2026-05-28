import { useParams, Link } from 'react-router-dom';

const PaymentPending = () => {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Menunggu Pembayaran</h1>
      <p className="text-gray-600 mb-6">
        Pesanan Anda sedang menunggu konfirmasi pembayaran.
      </p>
      
      <Link to="/bookings" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition inline-block">
        Lihat Pesanan Saya
      </Link>
    </div>
  );
};

export default PaymentPending;