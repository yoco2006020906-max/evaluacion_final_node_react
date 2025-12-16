import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, Package, Truck, CreditCard, Shield, Clock } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CartItem from '../../components/cart/CartItem'; 
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import CheckoutModal from '../../components/cart/CheckoutModal';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import axios from 'axios';
import Card from '../../components/common/Card';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotal, 
    refreshCart, 
    setCartItems 
  } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshCart();
    return () => {
      setCartItems([]);
    };
  }, []);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning('Tu carrito está vacío', {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    if (!isAuthenticated) {
      toast.info('Por favor inicia sesión para continuar', {
        position: 'bottom-right',
        autoClose: 2000,
      });
      navigate('/login');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleSubmitOrder = async (orderData) => {
    setLoading(true);
    try {
      const response = await axios.post('/orders', orderData);
      
      if (response.data.success) {
        const order = response.data.data;

        toast.success('¡Pedido creado exitosamente! Generando factura...', {
          position: "bottom-right",
          autoClose: 3000,
        });

        // Generar y descargar factura en cliente
        try {
          generateInvoice(order);
        } catch (err) {
          console.error('Error generando factura:', err);
        }

        setCartItems([]);
        setShowCheckoutModal(false);

        setTimeout(() => {
          navigate('/my-orders');
        }, 1500);
      }
    } catch (error) {
      console.error('Error al crear la orden:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el pedido';
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
    toast.success('Carrito vaciado', {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Totales calculados para pasar al modal de checkout
  const subtotal = getTotal();
  const shipping = subtotal > 100000 ? 0 : 10000;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  // Pantalla de carrito vacío
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-emerald-200/50">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30 mb-6 group hover:scale-110 transition-all duration-300">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-base text-emerald-700 font-medium mb-6">
              Agrega productos a tu carrito para continuar con tu compra
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 text-sm font-bold shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Package className="w-4 h-4 mr-2" />
              Explorar Productos
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

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-200/50 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="group mb-3 lg:mb-0 flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-sm transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Seguir Comprando
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-2">
              Carrito de Compras
            </h1>
            <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}</span>
            </div>
          </div>

          {cartItems.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setShowClearModal(true)}
              className="px-4 py-2 text-sm font-bold border border-rose-400/50 hover:border-rose-500 bg-white/50 backdrop-blur-xl shadow-md hover:shadow-rose-500/25 group hover:scale-105 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-rose-600" />
              Vaciar Carrito
            </Button>
          )}
        </div>

        {/* Contenido del carrito */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={item._id || item.productoId} className={`group ${index % 2 === 0 ? 'lg:translate-x-2 hover:-translate-x-0' : '-lg:translate-x-2 hover:translate-x-0'} transition-all duration-500`}>
                <CartItem
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              </div>
            ))}

            {/* Información adicional */}
            <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-6 group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 rounded-2xl">
              <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-emerald-500" />
                Envío Gratis
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/50 group-hover:bg-emerald-100/50 transition-all">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-emerald-800">Compras superiores a $100.000</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-teal-50/50 rounded-xl border border-teal-200/50 group-hover:bg-teal-100/50 transition-all">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <span className="font-medium text-teal-800">Entregas en 2-5 días hábiles</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-200/50 group-hover:bg-blue-100/50 transition-all">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  <span className="font-medium text-blue-800">Rastreo en tiempo real</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <CartSummary
              subtotal={getTotal()}
              onCheckout={handleCheckout}
              loading={loading}
            />

            {/* Métodos de pago */}
            <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-6 rounded-2xl group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Métodos de Pago
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="group/pago p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md border-2 border-white/30 hover:scale-110 hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <div className="group/pago p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-md border-2 border-white/30 hover:scale-110 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center">
                  <span className="text-2xl">🏦</span>
                </div>
                <div className="group/pago p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md border-2 border-white/30 hover:scale-110 hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-emerald-800 text-center bg-emerald-100/50 px-3 py-2 rounded-lg">
                Visa, Mastercard, PSE, Nequi y más
              </p>
            </Card>

            {/* Garantía */}
            <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-6 rounded-2xl group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
              <h3 className="text-lg font-bold text-emerald-900 mb-4 relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-emerald-500 group-hover:rotate-6 transition-transform" />
                Compra 100% Segura
              </h3>
              <ul className="space-y-2 text-sm relative z-10">
                <li className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/50 group-hover:bg-emerald-100/50 transition-all">
                  <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-emerald-800">Garantía de satisfacción</span>
                </li>
                <li className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/50 group-hover:bg-emerald-100/50 transition-all">
                  <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-emerald-800">Devoluciones fáciles</span>
                </li>
                <li className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/50 group-hover:bg-emerald-100/50 transition-all">
                  <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-emerald-800">Soporte 24/7</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de confirmación para vaciar carrito */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Vaciar Carrito"
        size="lg"
      >
        <div className="space-y-4 p-6 bg-gradient-to-br from-rose-50 to-red-50/50 rounded-2xl border-2 border-rose-200/50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg border-4 border-white/30">
              <Trash2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-rose-900 mb-3">¿Vaciar carrito?</h3>
            <p className="text-sm text-rose-700 font-medium">
              ¿Estás seguro que deseas vaciar tu carrito? Perderás <strong className="text-rose-900">{cartItems.length}</strong> productos.
            </p>
          </div>
          <div className="flex gap-3 pt-4 border-t-2 border-rose-200/50">
            <Button
              variant="danger"
              fullWidth
              onClick={handleClearCart}
              className="h-10 text-sm font-bold shadow-lg hover:shadow-rose-500/50 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
            >
              Sí, Vaciar Todo
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowClearModal(false)}
              className="h-10 text-sm font-bold border border-emerald-400/50 hover:border-emerald-500 bg-white/50 backdrop-blur-xl"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleSubmitOrder}
        loading={loading}
        total={total}
      />
    </div>
  );
};

export default CartPage;