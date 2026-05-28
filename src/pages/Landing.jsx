import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Landing = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setFeaturedProducts(response.data?.slice(0, 4) || []);
      } catch (error) {
        console.error('Gagal mengambil produk:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section dengan Background Image */}
      <section className="relative bg-cover bg-center bg-no-repeat min-h-[500px] flex items-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&auto=format")'
        }}
      >
        {/* Overlay gelap agar teks terbaca */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            Sewa Perlengkapan Camping
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md max-w-2xl mx-auto">
            Nikmati alam bebas tanpa repot beli perlengkapan. Kami sediakan semua kebutuhan campingmu!
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg"
          >
            Lihat Produk →
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Produk Favorit</h2>
            <p className="text-gray-500">Peralatan camping terbaik untuk petualanganmu</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Belum ada produk tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group">
                  <div className="overflow-hidden">
                    <img
                      src={product.thumbnail || 'https://placehold.co/600x400/2E7D32/white?text=CampGear'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-green-600 font-bold text-lg">
                      Rp {product.price_per_day?.toLocaleString() || 0}<span className="text-sm font-normal">/hari</span>
                    </p>
                    {product.stock_limited && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                        ⚠️ Stok terbatas
                      </span>
                    )}
                    <Link
                      to={`/products/${product.slug}`}
                      className="block text-center mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section: Kenapa Pilih Kami */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Kenapa Pilih CampGear?</h2>
            <p className="text-gray-500">Kami berkomitmen memberikan yang terbaik untuk petualanganmu</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Peralatan Berkualitas</h3>
              <p className="text-gray-500 text-sm">Semua peralatan kami terawat dan berkualitas tinggi</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Pengiriman Tepat Waktu</h3>
              <p className="text-gray-500 text-sm">Pengiriman sesuai jadwal yang dipilih</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Harga Terjangkau</h3>
              <p className="text-gray-500 text-sm">Harga sewa yang ramah di kantong</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;