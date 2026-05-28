import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SkeletonCard from '../components/SkeletonCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Gagal mengambil kategori:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = category ? `/products/category/${category}` : '/products';
        const response = await api.get(url);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Gagal mengambil produk:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Filter produk berdasarkan search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton Loader saat loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Semua Produk</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Semua Produk</h1>

      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Kategori - Responsive wrapping */}
      <div className="flex justify-center gap-2 md:gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setCategory('')}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base transition ${
            !category ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base transition ${
              category === cat.slug ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Hasil Pencarian */}
      {searchTerm && (
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredProducts.length} hasil untuk "{searchTerm}"
          </p>
        </div>
      )}

      {/* Grid Produk */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {searchTerm 
              ? `Tidak ada produk yang cocok dengan "${searchTerm}"` 
              : 'Belum ada produk tersedia.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group"
            >
              {/* Thumbnail */}
              <div className="overflow-hidden">
                <img
                 src={`${product.thumbnail}?t=${new Date().getTime()}`}
                  alt={product.name}
                  className="..."
                />
              </div>
              
              {/* Content */}
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-1">{product.name}</h3>
                
                <p className="text-green-600 font-bold text-sm md:text-base">
                  Rp {product.price_per_day?.toLocaleString() || 0}/hari
                </p>
                
                {product.stock_limited && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                    ⚠️ Stok terbatas
                  </span>
                )}
                
                <Link
                  to={`/products/${product.slug}`}
                  className="block text-center mt-3 bg-green-600 text-white py-2 rounded text-sm md:text-base hover:bg-green-700 transition"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;