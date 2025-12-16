import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Loader, CheckCircle, Clock, AlertCircle, RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import OrderCard from '../../components/orders/OrderCard';
import Button from '../../components/common/Button';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/orders');
      
      if (response.data.success) {
        // Transformar datos del backend al formato del frontend
        const transformedOrders = response.data.data.map(order => ({
          id: order._id,
          orderNumber: `#${order._id.slice(-8).toUpperCase()}`,
          date: order.createdAt,
          status: order.estado,
          total: order.total,
          items: order.items.map(item => ({
            name: item.nombreProducto,
            quantity: item.cantidad,
            price: item.precio,
            image: item.imagenProducto
          })),
          direccionEnvio: order.direccionEnvio,
          telefono: order.telefono
        }));
        
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('❌ Error al cargar órdenes:', error);
      setError(error.response?.data?.message || 'Error al cargar las órdenes');
      
      toast.error('No se pudieron cargar las órdenes', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-200/30 border-t-emerald-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-teal-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Cargando tus pedidos
              </h2>
              <p className="text-emerald-200">
                Preparando tu historial de compras...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-red-400/30 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Error al cargar pedidos
                </h2>
                <p className="text-emerald-200 text-sm mb-6">
                  {error}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={fetchOrders}
                  className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar Carga
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Sin órdenes
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-emerald-400/30 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <ShoppingBag className="w-10 h-10 text-emerald-900" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  No tienes pedidos aún
                </h2>
                <p className="text-emerald-200 mb-6">
                  Cuando realices tu primera compra, aparecerá aquí tu historial
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Explorar Productos
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Lista de órdenes
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 shadow-2xl border border-emerald-400/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white mb-1">
                  Mis Pedidos
                </h1>
                <div className="flex items-center gap-2 text-emerald-100">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">
                    {orders.length} {orders.length === 1 ? 'pedido activo' : 'pedidos en total'}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              variant="primary"
              size="md"
              onClick={fetchOrders}
              className="px-5 py-2.5 text-sm font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-xl p-4 border border-emerald-400/30 shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-xs font-medium uppercase tracking-wide mb-1">Completados</p>
                <p className="text-3xl font-black text-white">
                  {orders.filter(o => o.status === 'completado').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-400/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-xl rounded-xl p-4 border border-amber-400/30 shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200 text-xs font-medium uppercase tracking-wide mb-1">En Proceso</p>
                <p className="text-3xl font-black text-white">
                  {orders.filter(o => o.status === 'pendiente').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-400/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500/20 to-cyan-600/20 backdrop-blur-xl rounded-xl p-4 border border-teal-400/30 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-200 text-xs font-medium uppercase tracking-wide mb-1">Total Pedidos</p>
                <p className="text-3xl font-black text-white">
                  {orders.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-400/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-xl p-4 mb-6 border border-emerald-400/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Historial Completo de Pedidos</p>
              <p className="text-xs text-emerald-200">Todas tus órdenes organizadas cronológicamente</p>
            </div>
          </div>
        </div>

        {/* Grid de órdenes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mb-6">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className="transform hover:-translate-y-2 transition-all duration-300"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-emerald-400/20 text-center">
          <p className="text-emerald-200 text-sm">
            ¿Necesitas ayuda con un pedido? 
            <button className="text-emerald-400 font-bold ml-2 hover:text-emerald-300 transition-colors">
              Contacta soporte
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;