import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, ChevronDown, AlertCircle, RefreshCw, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import OrderStatus from '../../components/orders/OrderStatus';
import { ORDER_STATUS_LIST } from '../../utils/constants';
import { formatPrice, formatDate } from '../../utils/formatters';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate()

  // Modal de cambio de estado
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ==================== MAPEO DE ESTADOS ====================
  const statusMap = {
    'pendiente': 'Pendiente',
    'en_produccion': 'En Producción',
    'enviando': 'Enviando',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };

  const reverseStatusMap = {
    'Pendiente': 'pendiente',
    'En Producción': 'en_produccion',
    'Enviando': 'enviando',
    'Entregado': 'entregado',
    'Cancelado': 'cancelado'
  };

  const statusFlowMap = {
    'Pendiente': ['En Producción', 'Cancelado'],
    'En Producción': ['Enviando', 'Cancelado'],
    'Enviando': ['Entregado'],
    'Entregado': [],
    'Cancelado': []
  };

  // ==================== EFECTOS ====================
  useEffect(() => {
    fetchOrders();
  }, []);

  // ==================== FUNCIONES DE API ====================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/orders');

      // Transformar datos del backend al formato del frontend
      const transformedOrders = response.data.data.map(order => ({
        id: order._id,
        orderNumber: `ORD-${new Date(order.createdAt).getFullYear()}-${order._id.slice(-6).toUpperCase()}`,
        customer: order.usuario?.nombre || 'Usuario desconocido',
        customerEmail: order.usuario?.email || '',
        date: order.createdAt,
        status: statusMap[order.estado] || order.estado,
        backendStatus: order.estado,
        total: order.total,
        items: order.items?.length || 0,
        direccionEnvio: order.direccionEnvio,
        telefono: order.telefono,
        rawOrder: order
      }));

      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || newStatus === selectedOrder.status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError(null);

      const backendStatus = reverseStatusMap[newStatus];
      await axios.patch(`/orders/${selectedOrder.id}/status`, { estado: backendStatus });
      toast.success('El producto ha sido actualizado', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      
      // Actualizar la lista local
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus, backendStatus }
            : order
        )
      );

      closeModal();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setError(err.message || 'Error al actualizar el estado del pedido');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ==================== HANDLERS ====================
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const closeModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // ==================== FILTROS Y BÚSQUEDA ====================
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === '' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ==================== ESTADÍSTICAS ====================
  const stats = {
    total: orders.length,
    pendientes: orders.filter(o => o.status === 'Pendiente').length,
    enProceso: orders.filter(o =>
      o.status === 'En Producción' || o.status === 'Enviando'
    ).length,
    completados: orders.filter(o => o.status === 'Entregado').length
  };

  // ==================== RENDER: LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-48">
              <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-emerald-200/50">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4 shadow-lg"></div>
                <p className="text-lg font-black text-emerald-900">Cargando pedidos...</p>
                <p className="text-emerald-600 font-semibold text-sm mt-1">Preparando tu panel de gestión</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: PRINCIPAL ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* ========== HEADER ========== */}
          <div className="mb-6 flex items-center justify-between">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-emerald-200/50">
              <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                Gestión de Pedidos
              </h1>
              <p className="text-sm text-emerald-700 font-semibold leading-relaxed">
                Administra y actualiza el estado de todos los pedidos en tiempo real
              </p>
            </div>
            <Button
              variant="outline"
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/50 hover:from-emerald-500 hover:to-teal-500 text-emerald-900 text-sm font-black shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar
            </Button>
          </div>

          {/* ========== MENSAJE DE ERROR ========== */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/30 rounded-xl backdrop-blur-sm shadow-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-base font-black text-rose-800 mb-1">¡Error!</p>
                <p className="text-sm text-rose-700 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-rose-500 hover:text-rose-700 font-black text-lg p-1 hover:scale-110 transition-all"
              >
                ✕
              </button>
            </div>
          )}

          {/* ========== ESTADÍSTICAS ========== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-emerald-700 font-bold text-xs mb-2 uppercase tracking-wide">Total Pedidos</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
                    {stats.total.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <Package className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-amber-600 font-bold text-xs mb-2 uppercase tracking-wide">Pendientes</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
                    {stats.pendientes}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <Clock className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-blue-600 font-bold text-xs mb-2 uppercase tracking-wide">En Proceso</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
                    {stats.enProceso}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <Truck className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-emerald-600 font-bold text-xs mb-2 uppercase tracking-wide">Completados</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent drop-shadow-lg">
                    {stats.completados}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <CheckCircle className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>
            </Card>
          </div>

          {/* ========== BÚSQUEDA Y FILTROS ========== */}
          <Card className="mb-6 bg-white/80 backdrop-blur-xl border border-emerald-200/50 shadow-lg">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4 group-hover:scale-110 transition-all" />
                  <input
                    type="text"
                    placeholder="🔍 Buscar por número de orden, cliente o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 border border-emerald-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/75 placeholder-emerald-500 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                  />
                </div>

                <div className="flex items-center gap-2 min-w-[200px]">
                  <Filter className="w-4 h-4 text-emerald-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm bg-emerald-50/50 border border-emerald-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/75 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <option value="">Todos los estados</option>
                    {ORDER_STATUS_LIST.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* ========== TABLA DE PEDIDOS ========== */}
          <Card className="bg-white/80 backdrop-blur-xl border border-emerald-200/50 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-emerald-300/50">
                    <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Pedido</th>
                    <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Cliente</th>
                    <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Estado</th>
                    <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Total</th>
                    <th className="text-center py-3 px-4 font-black text-sm text-emerald-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-emerald-100/50 hover:bg-emerald-50/50 transition-all duration-300 group"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-black text-emerald-900 group-hover:text-emerald-700">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                            {order.items} producto(s)
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-bold text-emerald-900">{order.customer}</p>
                          <p className="text-xs text-emerald-600 mt-0.5">{order.customerEmail}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-emerald-700">
                          {formatDate(order.date, 'numeric')}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <OrderStatus status={order.status} size="sm" />
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-base font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-md">
                          {formatPrice(order.total)}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openStatusModal(order)}
                            disabled={
                              order.status === 'Entregado' ||
                              order.status === 'Cancelado'
                            }
                            className={`
                              px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 font-black shadow-md hover:shadow-lg hover:scale-105 active:scale-95 duration-300 border
                              ${order.status === 'Entregado' || order.status === 'Cancelado'
                                ? 'bg-gray-300/50 text-gray-500 border-gray-300 cursor-not-allowed shadow-none' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 hover:from-emerald-600 hover:to-teal-600'
                              }
                            `}
                          >
                            Cambiar Estado
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleViewDetails(order.id)}
                            className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-lg shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Sin resultados */}
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-dashed border-emerald-200/50">
                  <Package className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <p className="text-xl font-black text-emerald-900 mb-2">
                    {searchTerm || filterStatus
                      ? 'No se encontraron pedidos'
                      : 'No hay pedidos registrados'}
                  </p>
                  {(searchTerm || filterStatus) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('');
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer con contador */}
            {filteredOrders.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-emerald-200/50 bg-emerald-50/50">
                <p className="text-sm font-black text-emerald-900">
                  Mostrando <span className="text-emerald-600">{filteredOrders.length}</span> de <span className="text-emerald-600">{orders.length}</span> pedidos
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ========== MODAL DE CAMBIO DE ESTADO ========== */}
      <Modal
        isOpen={showStatusModal}
        onClose={!updatingStatus ? closeModal : undefined}
        title="Cambiar Estado del Pedido"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-md">
                <p className="text-xs text-emerald-700 font-bold mb-2">Pedido</p>
                <p className="text-lg font-black text-emerald-900">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-md">
                <p className="text-xs text-emerald-700 font-bold mb-2">Cliente</p>
                <p className="text-base font-black text-emerald-900">
                  {selectedOrder.customer}
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-md">
              <p className="text-xs text-emerald-700 font-bold mb-3">Estado Actual</p>
              <OrderStatus status={selectedOrder.status} size="md" />
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-md">
              <label className="block text-sm font-black text-emerald-900 mb-3">
                Nuevo Estado
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={updatingStatus}
                className="w-full px-4 py-3 text-sm border border-emerald-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/75 font-bold bg-emerald-50/50 shadow-sm hover:shadow-md transition-all duration-300 disabled:bg-gray-100/50"
              >
                <option value={selectedOrder.status}>
                  {selectedOrder.status}
                </option>
                {statusFlowMap[selectedOrder.status]?.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                fullWidth
                onClick={handleUpdateStatus}
                disabled={newStatus === selectedOrder.status || updatingStatus}
                className="h-12 text-sm font-black shadow-lg hover:shadow-emerald-500/50 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {updatingStatus ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Estado'
                )}
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={closeModal}
                disabled={updatingStatus}
                className="h-12 text-sm font-black border border-emerald-400/50 hover:border-emerald-500 py-3"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageOrdersPage;