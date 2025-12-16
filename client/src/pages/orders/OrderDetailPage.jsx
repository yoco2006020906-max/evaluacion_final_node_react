import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Package, Truck, CreditCard, AlertCircle, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { OrderStatusTimeline } from '../../components/orders/OrderStatus';
import { formatPrice, formatDate } from '../../utils/formatters';
import axios from 'axios';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ==================== ESTADO ====================
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==================== MAPEO DE ESTADOS ====================
  const statusMap = {
    'pendiente': 'Pendiente',
    'en_produccion': 'En Producción',
    'enviando': 'Enviando',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };

  // ==================== FUNCIONES DE API ====================
  const fetchOrderDetail = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/orders/${id}`);
      const orderData = response.data.data;

      // Transformar datos del backend al formato del frontend
      const transformedOrder = {
        id: orderData._id,
        orderNumber: `ORD-${new Date(orderData.createdAt).getFullYear()}-${orderData._id.slice(-6).toUpperCase()}`,
        date: orderData.createdAt,
        status: statusMap[orderData.estado] || orderData.estado,
        backendStatus: orderData.estado,
        
        // Items del pedido
        items: orderData.items.map(item => ({
          id: item.productoId,
          name: item.nombreProducto,
          price: item.precio,
          quantity: item.cantidad,
          subtotal: item.subtotal,
          image: item.imagenProducto || 'https://via.placeholder.com/300'
        })),
        
        // Totales
        subtotal: orderData.total,
        shipping: 0,
        tax: Math.round(orderData.total * 0.19),
        total: orderData.total,
        
        // Información del usuario
        customer: {
          id: orderData.usuario?._id,
          name: orderData.usuario?.nombre || 'Usuario',
          email: orderData.usuario?.email || '',
          phone: orderData.usuario?.telefono || orderData.telefono
        },
        
        // Dirección de envío
        shippingAddress: {
          name: orderData.usuario?.nombre || 'Usuario',
          address: orderData.direccionEnvio?.calle || '',
          city: orderData.direccionEnvio?.ciudad || '',
          state: orderData.direccionEnvio?.pais || '',
          zipCode: orderData.direccionEnvio?.codigoPostal || '',
          phone: orderData.telefono
        },
        
        // Información adicional
        paymentMethod: 'Tarjeta de Crédito',
        trackingNumber: orderData.estado === 'enviando' || orderData.estado === 'entregado' 
          ? `TRK${orderData._id.slice(-9).toUpperCase()}` 
          : null,
        estimatedDelivery: orderData.estado === 'enviando' 
          ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() 
          : null,
        
        // Datos originales
        rawOrder: orderData
      };

      setOrder(transformedOrder);
    } catch (err) {
      console.error('Error al cargar detalle de orden:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar el pedido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ==================== EFECTOS ====================
  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // ==================== RENDER: LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-emerald-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-emerald-200/50 rounded-xl w-3/4"></div>
                <div className="space-y-4">
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl"></div>
                  <div className="h-40 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-emerald-200/50 rounded-2xl"></div>
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl"></div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== RENDER: ERROR ====================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-rose-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="group mb-6 flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-sm transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver a Mis Pedidos
            </button>
            
            <Card className="bg-white/80 backdrop-blur-xl text-center py-12 px-6 shadow-lg border border-rose-200/50">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30 group hover:rotate-12 transition-all duration-300">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-900 via-gray-900 to-red-700 bg-clip-text text-transparent mb-3">
                Error al cargar pedido
              </h2>
              <p className="text-sm text-rose-700 font-medium mb-6">
                {error}
              </p>
              <Button 
                onClick={fetchOrderDetail}
                className="px-6 py-2.5 text-sm font-bold shadow-lg hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
              >
                Intentar de Nuevo
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== RENDER: SIN ORDEN ====================
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <Card className="bg-white/80 backdrop-blur-xl py-12 px-6 shadow-lg border border-emerald-200/50">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30 group hover:scale-110 transition-all duration-300">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-3">
                Pedido no encontrado
              </h2>
              <p className="text-sm text-emerald-700 font-medium mb-6">
                No se pudo encontrar el pedido solicitado
              </p>
              <Button 
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 text-sm font-bold shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Volver al Historial
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== RENDER: PRINCIPAL ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* ========== HEADER ========== */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group mb-4 flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-sm transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver a Mis Pedidos
          </button>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-200/50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-2">
                Pedido {order.orderNumber}
              </h1>
              <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Realizado el {formatDate(order.date, 'long')}</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="px-4 py-2 text-sm font-bold border border-emerald-400/50 hover:border-emerald-500 bg-white/50 backdrop-blur-xl shadow-md whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Descargar Factura
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ========== COLUMNA IZQUIERDA: PRODUCTOS Y DETALLES ========== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline de Estado */}
            <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-6">
              <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Estado del Pedido
              </h2>
              <OrderStatusTimeline currentStatus={order.status} />
              
              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-md">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-900 mb-1">
                        Número de rastreo
                      </p>
                      <p className="text-base font-semibold text-blue-700 bg-blue-100/50 px-3 py-1.5 rounded-lg inline-block">
                        {order.trackingNumber}
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          📦 Entrega estimada: {formatDate(order.estimatedDelivery, 'long')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Productos */}
            <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-6">
              <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-500" />
                Productos ({order.items.length})
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id} className={`group flex gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${index % 2 === 0 ? 'border-emerald-200/50 bg-emerald-50/30' : 'border-teal-200/50 bg-teal-50/30'}`}>
                    <div className="w-16 h-16 flex-shrink-0 relative overflow-hidden rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white/50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300?text=Producto';
                        }}
                      />
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold shadow-md">
                        x{item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-emerald-900 mb-1 group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-emerald-600 font-semibold">
                        {formatPrice(item.price)} c/u
                      </p>
                    </div>
                    
                    <div className="text-right self-end">
                      <p className="text-xs text-emerald-600 mb-1 font-medium">Subtotal</p>
                      <p className="text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Dirección + Cliente + Pago */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-4 group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
                <h2 className="text-base font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  Dirección de Envío
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="font-bold text-emerald-900">{order.shippingAddress.name}</p>
                  {order.shippingAddress.address && (
                    <p className="text-emerald-700 font-medium">{order.shippingAddress.address}</p>
                  )}
                  <p className="text-emerald-700 font-medium">
                    {order.shippingAddress.city}
                    {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                  </p>
                  {order.shippingAddress.zipCode && (
                    <p className="text-emerald-600 text-xs">{order.shippingAddress.zipCode}</p>
                  )}
                  {order.shippingAddress.phone && (
                    <div className="flex items-center gap-2 pt-3 border-t border-emerald-200/50 mt-3">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-emerald-800 text-xs">{order.shippingAddress.phone}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-4 group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
                <h2 className="text-base font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  Cliente
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/50">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-emerald-800 text-xs">{order.customer.email}</span>
                  </div>
                  {order.customer.phone && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-200/50">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-blue-800 text-xs">{order.customer.phone}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-4 group hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
                <h2 className="text-base font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  Método de Pago
                </h2>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md border-2 border-white/50">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      {order.paymentMethod}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      ✅ Transacción completada
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ========== COLUMNA DERECHA: RESUMEN ========== */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">
            <Card className="bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200/50 p-6 rounded-2xl group hover:shadow-emerald-500/20 transition-all duration-300">
              <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                💰 Resumen
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 px-4 bg-emerald-50/50 rounded-lg border border-emerald-200/50 text-sm">
                  <span className="font-semibold text-emerald-800">Subtotal</span>
                  <span className="font-bold text-emerald-900">
                    {formatPrice(order.items.reduce((sum, item) => sum + item.subtotal, 0))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 px-4 bg-emerald-50/30 rounded-lg border border-emerald-300/50 text-sm">
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    🚚 Envío
                  </span>
                  <span className="text-sm font-bold text-emerald-600">¡GRATIS!</span>
                </div>
                
                <div className="pt-4 border-t-2 border-emerald-200/50">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-emerald-900">TOTAL</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Acciones */}
              <div className="space-y-2 mb-6">
                {order.trackingNumber && (
                  <Button variant="primary" fullWidth className="h-10 text-sm font-bold shadow-lg hover:shadow-emerald-500/50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    📦 Rastrear Pedido
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => window.location.href = 'mailto:soporte@techstore.com'}
                  className="h-10 text-sm font-bold border border-emerald-400/50 hover:border-emerald-500 bg-white/50 backdrop-blur-xl"
                >
                  💬 Contactar Soporte
                </Button>
              </div>
              
              {/* Ayuda */}
              <div className="pt-6 border-t-2 border-emerald-200/50">
                <p className="text-sm font-bold text-emerald-900 mb-4">¿Necesitas ayuda?</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/50 hover:bg-emerald-100/50 transition-all group">
                    <Mail className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <a href="mailto:soporte@techstore.com" className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors">
                      soporte@techstore.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/50 hover:bg-emerald-100/50 transition-all group">
                    <Phone className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <a href="tel:+573001234567" className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors">
                      +57 300 123 4567
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;