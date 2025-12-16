import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Minus, Plus, ArrowLeft, Check, Package, Sparkles } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api.service';
import { useAuth } from '../../hooks/useAuth';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth()

  const setActualProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products/' + id)
      setProduct(data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setActualProduct()
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-emerald-200/50 animate-pulse">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 bg-emerald-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-emerald-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-emerald-200 rounded-lg w-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-80 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl"></div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-8 bg-emerald-200 rounded-xl w-4/5"></div>
                  <div className="h-12 bg-emerald-200 rounded-xl"></div>
                  <div className="h-20 bg-emerald-200 rounded-xl"></div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-emerald-200 rounded-xl flex-1"></div>
                    <div className="h-10 bg-emerald-200 rounded-xl flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mt-8 shadow-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-rose-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto text-center bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-rose-200/50">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30">
              <Package className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-900 via-gray-900 to-red-700 bg-clip-text text-transparent mb-4">
              Producto no encontrado
            </h2>
            <Button 
              onClick={() => navigate(-1)}
              className="px-8 py-3 text-base font-bold shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border border-emerald-400/50 h-fit mt-4"
            >
              Volver a Productos
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumb y botón volver */}
        <div className="flex items-center gap-4 mb-8 bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-emerald-200/50">
          <button
            onClick={() => navigate(-1)}
            className="group p-2 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-all duration-300 hover:scale-105 shadow-md border border-emerald-300/50"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-700 group-hover:text-emerald-800 transition-all group-hover:-translate-x-1" />
          </button>
          <div className="flex-1 text-sm font-semibold text-emerald-800 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 px-4 py-2 rounded-lg border border-emerald-200/50">
            / {product.categoria} / {product.nombre}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Imagen del producto */}
          <div className="group relative">
            <Card className="overflow-hidden shadow-xl group hover:shadow-emerald-500/25 transition-all duration-700 h-96 bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-2xl">
              <div className="aspect-square w-full h-full relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 group-hover:brightness-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600?text=Producto+Premium';
                  }}
                />
                <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-xl text-white px-3 py-1.5 rounded-lg shadow-lg border border-white/30 font-bold text-sm">
                  Stock: {product.stock}
                </div>
                {product.stock > 20 && (
                  <div className="absolute bottom-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl shadow-lg font-bold text-sm border-2 border-white/30">
                    🟢 STOCK ALTO
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-xl shadow-xl border border-emerald-200/50 p-6 rounded-2xl group hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500">
              {/* Categoría */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-300/50 text-xs font-bold text-emerald-800 mb-4">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                {product.categoria}
              </div>

              {/* Nombre */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-4 leading-tight">
                {product.nombre}
              </h1>

              {/* Precio y Stock */}
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-300/50">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  {formatPrice(product.precio)}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100/50 rounded-lg border border-emerald-200/50 font-semibold text-emerald-800">
                    <Package className="w-4 h-4" />
                    {product.stock} unidades disponibles
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-700 rounded-lg border border-emerald-400/50 font-semibold text-sm">
                    <Check className="w-4 h-4" />
                    Disponible
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/50">
                <p className="text-sm text-emerald-800 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Cantidad */}
              <div className="mb-6">
                <label className="block text-base font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center bg-white shadow-lg rounded-xl border-2 border-emerald-200/50 overflow-hidden group hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all group-hover:bg-emerald-100"
                    >
                      <Minus className="w-4 h-4 text-emerald-600" />
                    </button>
                    <span className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl min-w-[4rem] text-center shadow-inner">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all group-hover:bg-emerald-100"
                    >
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </button>
                  </div>
                  <div className="text-lg font-bold text-emerald-900 bg-emerald-100/50 px-4 py-2 rounded-xl border border-emerald-300/50 shadow-md">
                    Total: {formatPrice(product.precio * quantity)}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !user}
                  className="h-12 text-sm font-bold shadow-lg hover:shadow-emerald-500/50 group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-2 border-emerald-400/50"
                >
                  <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Agregar al Carrito
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || !user}
                  className="h-12 text-sm font-bold shadow-lg hover:shadow-emerald-500/50 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-2 border-blue-400/50"
                >
                  🚀 Comprar Ahora
                </Button>
              </div>

              {/* Acciones adicionales */}
              <div className="flex gap-4 pt-4 border-t-2 border-emerald-200/50">
                <button className="group flex items-center gap-2 p-3 rounded-xl border border-emerald-200/50 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:shadow-md">
                  <Heart className="w-5 h-5 group-hover:scale-110 group-hover:text-red-500 transition-all" />
                  Favoritos
                </button>
                <button className="group flex items-center gap-2 p-3 rounded-xl border border-emerald-200/50 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:shadow-md">
                  <Share2 className="w-5 h-5 group-hover:scale-110 group-hover:rotate-180 transition-all" />
                  Compartir
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Características y especificaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-xl shadow-xl border border-emerald-200/50 p-6 group hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 rounded-2xl">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3 group-hover:scale-105 transition-transform">
              ✨ Características Premium
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/50 group-hover:bg-emerald-100/50 transition-all">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-emerald-800 leading-relaxed">Calidad superior garantizada</span>
              </div>
              <div className="flex items-start gap-3 p-4 bg-teal-50/50 rounded-xl border border-teal-200/50 group-hover:bg-teal-100/50 transition-all">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-teal-800 leading-relaxed">Diseño moderno y funcional</span>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50 group-hover:bg-blue-100/50 transition-all">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-blue-800 leading-relaxed">Soporte técnico incluido</span>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl shadow-xl border border-emerald-200/50 p-6 group hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 rounded-2xl">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3 group-hover:scale-105 transition-transform">
              📋 Especificaciones
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/50 group-hover:bg-emerald-100/50 transition-all">
                <span className="font-semibold text-emerald-800">Stock Disponible</span>
                <span className="font-bold text-emerald-900">{product.stock} unidades</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-teal-50/50 rounded-xl border border-teal-200/50 group-hover:bg-teal-100/50 transition-all">
                <span className="font-semibold text-teal-800">Categoría</span>
                <span className="font-bold text-teal-900">{product.categoria}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-xl border border-blue-200/50 group-hover:bg-blue-100/50 transition-all">
                <span className="font-semibold text-blue-800">Estado</span>
                <span className="font-bold text-emerald-900">🟢 Disponible</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;