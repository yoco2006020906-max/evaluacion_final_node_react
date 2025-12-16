import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Loader, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-emerald-200/50">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30 mb-6">
              <Loader className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-3">
              Cargando tus pedidos
            </h2>
            <p className="text-base text-emerald-700 font-medium mb-6">
              Preparando tu historial de compras...
            </p>
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-rose-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-rose-200/50">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30 mb-6 group hover:rotate-12 transition-all duration-300">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-900 via-gray-900 to-red-700 bg-clip-text text-transparent mb-3">
              Error al cargar pedidos
            </h2>
            <p className="text-base text-rose-700 font-medium mb-6">
              {error}
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={fetchOrders}
              className="px-6 py-2.5 text-sm font-bold shadow-lg hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar Carga
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Sin órdenes
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-emerald-200/50">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30 mb-6 group hover:scale-110 transition-all duration-300">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-3">
              No tienes pedidos aún
            </h2>
            <p className="text-base text-emerald-700 font-medium mb-6">
              Cuando realices tu primera compra, aparecerá aquí tu historial
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

  // Lista de órdenes
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-200/50 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-2">
                Mis Pedidos
              </h1>
              <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>Tienes <span className="text-emerald-600">{orders.length}</span> {orders.length === 1 ? 'pedido' : 'pedidos'}</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={fetchOrders}
              className="px-4 py-2 text-sm font-bold shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Filtros y ordenamiento */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 mb-6 border border-emerald-200/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 bg-emerald-500/10 rounded-xl p-3 border border-emerald-200/50">
              <Package className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-emerald-900">Historial Completo</p>
                <p className="text-xs text-emerald-700">Todas tus órdenes organizadas</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={fetchOrders}
                className="px-4 py-2 text-sm border border-emerald-300/50 hover:border-emerald-400 bg-emerald-50/50 backdrop-blur-xl font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refrescar Lista
              </Button>
            </div>
          </div>
        </div>

        {/* Grid de órdenes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className={`group hover:-translate-y-1 transition-all duration-300 ${
                index % 2 === 0 ? 'lg:hover:translate-x-2' : 'lg:hover:-translate-x-2'
              }`}
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>

        {/* Stats finales */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-emerald-200/50 text-center group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3 group-hover:scale-110 transition-all" />
            <p className="text-2xl font-bold text-emerald-900 mb-1">{orders.filter(o => o.status === 'completado').length}</p>
            <p className="text-xs text-emerald-700 font-medium">Completados</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-emerald-200/50 text-center group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
            <Clock className="w-8 h-8 text-amber-500 mx-auto mb-3 group-hover:scale-110 transition-all" />
            <p className="text-2xl font-bold text-amber-900 mb-1">{orders.filter(o => o.status === 'pendiente').length}</p>
            <p className="text-xs text-amber-700 font-medium">En Proceso</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-emerald-200/50 text-center group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
            <Package className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-all" />
            <p className="text-2xl font-bold text-emerald-900 mb-1">{orders.length}</p>
            <p className="text-xs text-emerald-700 font-medium">Total Pedidos</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;