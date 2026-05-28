import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist saat component pertama kali load
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);

        const response = await api.get('/wishlist');

        setWishlist(response.data || []);
      } catch (error) {
        console.error('Gagal mengambil wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Hapus item wishlist
  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      // Update state tanpa fetch ulang
      setWishlist((prevWishlist) =>
        prevWishlist.filter(
          (item) => item.product?.id !== productId
        )
      );
    } catch (error) {
      console.error('Gagal menghapus wishlist:', error);
      alert('Gagal menghapus dari wishlist');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500 text-lg">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Wishlist Saya
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            Belum ada produk di wishlist.
          </p>

          <Link
            to="/products"
            className="inline-block mt-4 text-green-600 hover:underline"
          >
            Lihat Produk →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Thumbnail */}
              <img
                src={
                  item.product?.thumbnail ||
                  'https://placehold.co/600x400/2E7D32/white?text=CampGear'
                }
                alt={item.product?.name || 'Product'}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {item.product?.name || 'Produk tidak tersedia'}
                </h3>

                <p className="text-green-600 font-bold text-xl">
                  Rp{' '}
                  {item.product?.price_per_day?.toLocaleString() || 0}
                  /hari
                </p>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <Link
                    to={`/products/${item.product?.slug}`}
                    className="flex-1 bg-green-600 text-white py-2 rounded text-center hover:bg-green-700 transition"
                  >
                    Lihat Detail
                  </Link>

                  <button
                    onClick={() =>
                      handleRemove(item.product?.id)
                    }
                    className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;