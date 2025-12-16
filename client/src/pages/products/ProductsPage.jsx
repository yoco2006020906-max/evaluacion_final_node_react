import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Grid3x3, Tag, Sparkles } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProductList from '../../components/products/ProductList';
import Button from '../../components/common/Button';
import { useCart } from '../../hooks/useCart';
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
import axios from 'axios';
import api from '../../services/api.service';

const ProductsPage = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {
        search: searchTerm || undefined,
        categoria: selectedCategory || undefined,
        sort: sortBy || undefined
      };

      const { data } = await api.get('/products', { params });
      setProducts(data.data);

    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UN SOLO useEffect con debounce para searchTerm
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 400); // Debounce solo para el search

    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <Header />

      {/* Hero Section - Más compacto */}
      <section className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full mb-4 backdrop-blur-md border border-white/30">
              <Grid3x3 className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold tracking-wide">+1,200 Productos Disponibles</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight drop-shadow-lg">
              Tienda Premium
            </h1>
            <p className="text-base md:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              La mejor selección de tecnología al mejor precio
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-10 pb-12">
        {/* Search & Controls - Más compacto */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 mb-6 shadow-2xl border border-emerald-200/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-emerald-500 p-2 rounded-lg group-focus-within:bg-emerald-600 transition-all duration-300">
                <Search className="w-4 h-4 text-white" />
              </div>
              <input
                type="text"
                placeholder="🔍 Busca cualquier producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-3 text-sm border-2 border-emerald-200/50 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 bg-gradient-to-r from-white to-emerald-50 font-semibold placeholder:text-emerald-400 transition-all duration-500 shadow-inner"
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 text-sm border-2 border-emerald-200/50 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 bg-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Active Filters Tags */}
          {(searchTerm || selectedCategory) && (
            <div className="mt-5 pt-5 border-t-2 border-emerald-200/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-emerald-800">Filtros activos:</span>
                {searchTerm && (
                  <div className="flex items-center bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 rounded-lg font-semibold text-sm shadow-lg">
                    "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-2 p-0.5 hover:bg-white/20 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {selectedCategory && (
                  <div className="flex items-center bg-gradient-to-r from-slate-800 to-slate-900 text-white px-3 py-1.5 rounded-lg font-semibold text-sm shadow-lg">
                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                    {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory('')}
                      className="ml-2 p-0.5 hover:bg-white/20 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold text-sm rounded-lg shadow-xl hover:shadow-2xl hover:from-rose-600 hover:to-red-600 transition-all duration-300"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpiar todo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Filters Sidebar */}
          <aside className={`xl:col-span-1 ${showFilters ? 'block' : 'hidden xl:block'}`}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-emerald-200/50 sticky top-24">
              <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-emerald-200/50">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl shadow-lg">
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-900">Filtros</h3>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="xl:hidden p-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-all duration-300"
                >
                  <X className="w-4 h-4 text-emerald-700" />
                </button>
              </div>

              {/* Categories Section */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-emerald-200/30">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider">
                    Categorías
                  </h4>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-emerald-50/80 transition-all duration-300 shadow-sm hover:shadow-md border border-emerald-100/50">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-3 text-sm font-bold text-emerald-800 group-hover:text-emerald-900 flex-1">
                      Todas las categorías
                    </span>
                    {selectedCategory === '' && (
                      <Sparkles className="ml-auto w-4 h-4 text-emerald-500 animate-pulse" />
                    )}
                  </label>
                  {PRODUCT_CATEGORIES.map(category => (
                    <label key={category} className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-emerald-50/80 transition-all duration-300 shadow-sm hover:shadow-md border border-emerald-100/50">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                      />
                      <span className="ml-3 text-sm font-bold text-emerald-800 group-hover:text-emerald-900 flex-1">
                        {category}
                      </span>
                      {selectedCategory === category && (
                        <Sparkles className="ml-auto w-4 h-4 text-emerald-500 animate-pulse" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Main Area */}
          <main className="xl:col-span-4">
            {/* Results Counter */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 text-white px-5 py-4 rounded-2xl mb-6 shadow-2xl border border-emerald-500/30 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Grid3x3 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-black leading-tight">
                      {products.length}
                    </p>
                    <p className="text-sm font-bold opacity-95">
                      {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </p>
                  </div>
                </div>
                {loading && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <span className="font-bold text-sm ml-2">Cargando...</span>
                  </div>
                )}
              </div>
            </div>

            <ProductList
              products={products}
              onAddToCart={addToCart}
              loading={loading}
            />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;