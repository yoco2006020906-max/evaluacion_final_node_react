import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Grid3x3, Tag, Sparkles } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProductList from '../../components/products/ProductList';
import { useCart } from '../../hooks/useCart';
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
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

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-emerald-100">
      <Header />

      {/* Hero compacto */}
      <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-sm border border-white/20">
              <Grid3x3 className="w-5 h-5 mr-2" />
              <span className="text-sm font-semibold">+1,200 Productos</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Catálogo Premium
            </h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Tecnología de vanguardia a precios excepcionales
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-12 pb-16">
        {/* Barra de búsqueda y controles */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-end">
            
            {/* Búsqueda */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-emerald-600 p-2.5 rounded-lg">
                <Search className="w-4 h-4 text-white" />
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-4 py-3.5 text-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-gray-50 font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Ordenar */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3.5 text-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white font-medium shadow-sm"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Botón filtros móvil */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600 text-white font-semibold text-sm rounded-2xl hover:bg-emerald-700 shadow-lg"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Tags de filtros activos */}
          {(searchTerm || selectedCategory) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Filtros:</span>
                {searchTerm && (
                  <div className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-xl font-medium text-sm">
                    "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-2 p-0.5 hover:bg-white/20 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {selectedCategory && (
                  <div className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-xl font-medium text-sm">
                    <Tag className="w-4 h-4 mr-2" />
                    {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory('')}
                      className="ml-2 p-0.5 hover:bg-white/20 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium text-sm rounded-xl hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                  Limpiar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          
          {/* Sidebar de filtros */}
          <aside className={`xl:col-span-1 ${showFilters ? 'block' : 'hidden xl:block'}`}>
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2.5 rounded-xl">
                    <SlidersHorizontal className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="xl:hidden p-2 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Categorías */}
              <div>
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-gray-900 uppercase">
                    Categorías
                  </h4>
                </div>
                <div className="space-y-2.5">
                  <label className="flex items-center cursor-pointer group p-3.5 rounded-xl hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-800 flex-1">
                      Todas las categorías
                    </span>
                    {selectedCategory === '' && (
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    )}
                  </label>
                  {PRODUCT_CATEGORIES.map(category => (
                    <label key={category} className="flex items-center cursor-pointer group p-3.5 rounded-xl hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-800 flex-1">
                        {category}
                      </span>
                      {selectedCategory === category && (
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Área de productos */}
          <main className="xl:col-span-4">
            
            {/* Contador de resultados */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-5 rounded-3xl mb-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Grid3x3 className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {products.length}
                    </p>
                    <p className="text-sm font-medium opacity-90">
                      {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </p>
                  </div>
                </div>
                {loading && (
                  <div className="flex items-center gap-2.5 bg-white/15 px-5 py-2.5 rounded-2xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <span className="font-semibold text-sm ml-1">Cargando...</span>
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