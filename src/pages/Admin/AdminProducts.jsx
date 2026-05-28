/* eslint-disable react-hooks/purity */
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    description: '',
    price_per_day: '',
    stock: '',
    thumbnail: '',
    is_active: true
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProducts();
    // eslint-disable-next-line react-hooks/immutability
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Gagal mengambil produk:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Gagal mengambil kategori:', error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP.');
      e.target.value = '';
      return;
    }

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB.');
      e.target.value = '';
      return;
    }

    // Validasi minimal ukuran (min 10KB)
    if (file.size < 10 * 1024) {
      alert('File terlalu kecil (minimal 10KB). Pastikan gambar tidak corrupt.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, thumbnail: reader.result });
      setUploading(false);
    };
    reader.onerror = () => {
      alert('Gagal membaca file gambar');
      setUploading(false);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.category_id || !form.description || !form.price_per_day || !form.stock) {
      alert('Semua field wajib diisi!');
      return;
    }

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, form);
        alert('Produk berhasil diupdate!');
      } else {
        await api.post('/admin/products', form);
        alert('Produk berhasil ditambahkan!');
      }
      fetchProducts();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Gagal menyimpan produk:', error);
      alert(error.response?.data?.error || 'Gagal menyimpan produk');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      alert('Produk berhasil dihapus!');
      fetchProducts();
    } catch (error) {
      console.error('Gagal menghapus produk:', error);
      alert('Gagal menghapus produk');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      price_per_day: product.price_per_day,
      stock: product.stock,
      thumbnail: product.thumbnail || '',
      is_active: product.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category_id: '',
      description: '',
      price_per_day: '',
      stock: '',
      thumbnail: '',
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Kelola Produk</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {product.thumbnail && (
                    <img 
                      src={`${product.thumbnail}?v=${product.updated_at || Date.now()}`}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/60x60/2E7D32/white?text=Error';
                      }}
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.category?.name || '-'}</td>
                <td className="px-4 py-3">Rp {product.price_per_day?.toLocaleString()}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Produk *</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kategori *</label>
                  <select 
                    value={form.category_id} 
                    onChange={(e) => setForm({...form, category_id: e.target.value})} 
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                  <textarea 
                    value={form.description} 
                    onChange={(e) => setForm({...form, description: e.target.value})} 
                    rows="3" 
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Harga/Hari *</label>
                    <input 
                      type="number" 
                      value={form.price_per_day} 
                      onChange={(e) => setForm({...form, price_per_day: e.target.value})} 
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stok *</label>
                    <input 
                      type="number" 
                      value={form.stock} 
                      onChange={(e) => setForm({...form, stock: e.target.value})} 
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Gambar Produk</label>
                  
                  {/* Preview gambar */}
                  {form.thumbnail && (
                    <div className="mb-3">
                      <img 
                        src={form.thumbnail}
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100/2E7D32/white?text=Error';
                        }}
                      />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                  {uploading && (
                    <p className="text-xs text-green-600 mt-1">Mengupload gambar...</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG, GIF, WEBP (Max 2MB, Min 10KB)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_active"
                    checked={form.is_active} 
                    onChange={(e) => setForm({...form, is_active: e.target.checked})} 
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="is_active" className="text-sm">Produk Aktif (dapat dilihat customer)</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={uploading}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Simpan'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setShowModal(false); resetForm(); }} 
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;