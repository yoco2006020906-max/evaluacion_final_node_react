import React, { useState, useEffect } from 'react';
import axios, { Axios } from 'axios';
import { Plus, Search, Edit2, Trash2, Eye, PackageSearch, Check, Box, AlertTriangle, ShoppingBag } from 'lucide-react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ProductForm from '../../components/products/ProductForm';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api.service';
import { toast } from 'react-toastify';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [categories, setCategories] = useState([]);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.categoria) params.categoria = filters.categoria;
      if (filters.estado) params.estado = filters.estado;

      const response = await api.get('/products', { params });
      setProducts(response.data.data);

      // Extraer categorías únicas
      const uniqueCategories = [];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros cuando cambien los valores de búsqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts({
        search: searchTerm,
        categoria: filterCategory
      });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterCategory]);

  const filteredProducts = products;

  const handleCreate = () => {
    setModalMode('create');
    setSelectedProduct(undefined);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${selectedProduct._id}`);
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      toast.success('Producto eliminado correctamente', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Error eliminando producto', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleSubmit = async () => {
    try{
      fetchProducts()
      setShowModal(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const getStockStatus = (stock) => {
    if (stock > 20) return { class: 'bg-emerald-100 text-emerald-800', label: 'Alto' };
    if (stock > 10) return { class: 'bg-amber-100 text-amber-800', label: 'Medio' };
    return { class: 'bg-rose-100 text-rose-800', label: 'Bajo' };
  };

  const getEstadoLabel = (estado) => {
    const estados = {
      'disponible': { label: 'Disponible', class: 'bg-emerald-100 text-emerald-800' },
      'agotado': { label: 'Agotado', class: 'bg-rose-100 text-rose-800' },
      'descontinuado': { label: 'Descontinuado', class: 'bg-gray-100 text-gray-800' }
    };
    return estados[estado] || { label: estado, class: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-emerald-200/50">
              <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                Gestión de Productos
              </h1>
              <p className="text-sm text-emerald-700 font-semibold leading-relaxed">
                Administra tu catálogo completo con controles avanzados
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreate}
              className="px-6 py-3 text-sm font-black shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 h-fit bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border border-emerald-400/50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Producto
            </Button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-emerald-700 font-bold text-sm mb-2 uppercase tracking-wide">Total Productos</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
                    {loading ? '...' : products.length.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <PackageSearch className="w-7 h-7 text-white drop-shadow-md" />
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-emerald-600 font-bold text-sm mb-2 uppercase tracking-wide">Disponibles</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent drop-shadow-lg">
                    {loading ? '...' : products.filter(p => p.estado === 'disponible').length}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <Check className="w-7 h-7 text-emerald-900 drop-shadow-md" />
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-rose-600 font-bold text-sm mb-2 uppercase tracking-wide">Stock Bajo</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                    {loading ? '...' : products.filter(p => p.stock <= 10).length}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-rose-500 to-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <AlertTriangle className="w-7 h-7 text-white drop-shadow-md" />
                </div>
              </div>
            </Card>
          </div>

          {/* Barra de búsqueda y filtros */}
          <Card className="mb-6 bg-white/80 backdrop-blur-xl border border-emerald-200/50 shadow-lg">
            <div className="p-5">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4 group-hover:scale-110 transition-all" />
                  <input
                    type="text"
                    placeholder="🔍 Buscar productos por nombre, categoría o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-emerald-50/50 border border-emerald-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/75 placeholder-emerald-500 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Tabla de productos */}
          <Card className="bg-white/80 backdrop-blur-xl border border-emerald-200/50 shadow-lg overflow-hidden">
            {loading ? (
              <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-dashed border-emerald-200/50">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4 shadow-lg"></div>
                <p className="text-xl font-black text-emerald-900 mb-1">Cargando productos...</p>
                <p className="text-sm text-emerald-600 font-semibold">Preparando tu catálogo</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                <p className="text-xl font-black text-rose-900 mb-2">{error}</p>
                <Button 
                  onClick={() => fetchProducts()} 
                  className="px-6 py-3 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl"
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-emerald-300/50">
                        <th className="text-left py-4 px-4 font-black text-sm text-emerald-900">Producto</th>
                        <th className="text-left py-4 px-4 font-black text-sm text-emerald-900">Categoría</th>
                        <th className="text-left py-4 px-4 font-black text-sm text-emerald-900">Precio</th>
                        <th className="text-left py-4 px-4 font-black text-sm text-emerald-900">Stock</th>
                        <th className="text-left py-4 px-4 font-black text-sm text-emerald-900">Estado</th>
                        <th className="text-center py-4 px-4 font-black text-sm text-emerald-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product.stock);
                        const estadoInfo = getEstadoLabel(product.estado);

                        return (
                          <tr key={product._id} className="border-b border-emerald-100/50 hover:bg-emerald-50/50 transition-all duration-300 group">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3 group-hover:scale-[1.01] transition-transform">
                                <div className="relative">
                                  <img
                                    src={product.imagen || 'https://via.placeholder.com/150'}
                                    alt={product.nombre}
                                    className="w-12 h-12 object-cover rounded-lg shadow-lg border-2 border-white/50 group-hover:shadow-emerald-500/30 transition-all duration-300"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/150';
                                    }}
                                  />
                                  <div className="absolute -top-1 -right-1 bg-emerald-500 text-white px-1.5 py-0.5 rounded-lg text-xs font-bold shadow-md">
                                    {product.stock}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-black text-emerald-900 group-hover:text-emerald-700">{product.nombre}</p>
                                  <p className="text-xs text-emerald-600 font-semibold">ID: {product._id.slice(-6)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-xs font-bold shadow-md">
                                {product.categoria}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-base font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
                                {formatPrice(product.precio)}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${stockStatus.class}`}>
                                {product.stock} unidades
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${estadoInfo.class}`}>
                                {estadoInfo.label}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-lg shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="p-2 bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 rounded-lg shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-dashed border-emerald-200/50">
                      <ShoppingBag className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
                      <p className="text-2xl font-black text-emerald-900 mb-2">No se encontraron productos</p>
                      <p className="text-sm text-emerald-600 font-semibold">Prueba con otros términos de búsqueda</p>
                    </div>
                  )}
                </div>

                {/* Paginación */}
                {!loading && !error && (
                  <div className="flex items-center justify-between pt-5 border-t border-emerald-200/50 bg-emerald-50/50 px-5 py-4 rounded-b-xl">
                    <p className="text-sm font-black text-emerald-900">
                      Mostrando <span className="text-emerald-600">{filteredProducts.length}</span> de <span className="text-emerald-600">{products.length}</span> productos
                    </p>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Modal de crear/editar producto */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
        size="xl"
      >
        <ProductForm
          mode={modalMode === 'create' ? 'crear' : 'editar'}
          initialData={selectedProduct}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Producto"
        size="lg"
      >
        <div className="space-y-6 p-6 bg-gradient-to-br from-rose-50 to-red-50/50 rounded-xl border-2 border-rose-200/50">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/50">
              <Trash2 className="w-10 h-10 text-white drop-shadow-md" />
            </div>
            <h3 className="text-2xl font-black text-rose-900 mb-3">¿Eliminar producto?</h3>
            <p className="text-base text-rose-700 font-semibold max-w-2xl mx-auto leading-relaxed">
              ¿Estás seguro que deseas eliminar el producto <strong className="text-rose-900">{selectedProduct?.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex gap-3 pt-6 border-t border-rose-200/50">
            <Button
              variant="danger"
              fullWidth
              onClick={confirmDelete}
              className="h-12 text-sm font-black shadow-lg hover:shadow-rose-500/50 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 border border-rose-500/50"
            >
              Sí, Eliminar Permanentemente
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
              className="h-12 text-sm font-black border border-emerald-400/50 hover:border-emerald-500 py-3 bg-white/50 backdrop-blur-xl"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageProductsPage;