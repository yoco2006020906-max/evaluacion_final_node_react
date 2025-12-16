import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, Activity, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import { formatPrice } from '../../utils/formatters';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    averageSale: 0,
    maxSale: 0,
    minSale: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/users/stats');
      
      if (response.data.success) {
        const data = response.data.message;
        const orderStats = data.orderStats[0] || {};
        
        setStats({
          totalSales: orderStats.totalVentas || 0,
          totalOrders: orderStats.numeroPedidos || 0,
          totalProducts: data.products || 0,
          totalUsers: data.users || 0,
          averageSale: orderStats.ventaPromedio || 0,
          maxSale: orderStats.ventaMaxima || 0,
          minSale: orderStats.ventaMinima || 0
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar las estadísticas', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, isLoading }) => (
    <Card hover className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 overflow-hidden bg-white/80 backdrop-blur-sm border border-emerald-200/50">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <p className="text-emerald-700 font-semibold text-xs mb-2 uppercase tracking-wide">{title}</p>
          {isLoading ? (
            <div className="h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg animate-pulse mb-2 w-3/4 shadow-md"></div>
          ) : (
            <p className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent drop-shadow-lg mb-2">
              {value}
            </p>
          )}
        </div>
        <div className={`${iconBg} group-hover:scale-110 transition-transform duration-300 p-3 rounded-xl shadow-lg border-2 border-white/30`}>
          <Icon className={`w-6 h-6 ${iconColor} drop-shadow-md`} />
        </div>
      </div>
    </Card>
  );

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En Producción': 'bg-blue-100 text-blue-800',
      'Enviando': 'bg-purple-100 text-purple-800',
      'Entregado': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-xl shadow-lg mb-4 backdrop-blur-xl border border-white/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-500">
              <Activity className="w-4 h-4" />
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight drop-shadow-md">
                Dashboard Admin
              </h1>
            </div>
            <p className="text-base text-emerald-700 font-semibold max-w-2xl mx-auto leading-relaxed">
              Panel de control completo con estadísticas en tiempo real
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Ventas Totales"
              value={formatPrice(stats.totalSales)}
              icon={DollarSign}
              iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
              iconColor="text-white"
              isLoading={loading}
            />
            <StatCard
              title="Total Pedidos"
              value={stats.totalOrders.toLocaleString()}
              icon={ShoppingCart}
              iconBg="bg-gradient-to-br from-blue-500 to-indigo-500"
              iconColor="text-white"
              isLoading={loading}
            />
            <StatCard
              title="Productos"
              value={stats.totalProducts.toLocaleString()}
              icon={Package}
              iconBg="bg-gradient-to-br from-purple-500 to-pink-500"
              iconColor="text-white"
              isLoading={loading}
            />
            <StatCard
              title="Usuarios"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              iconBg="bg-gradient-to-br from-indigo-500 to-purple-500"
              iconColor="text-white"
              isLoading={loading}
            />
          </div>

          {/* Tarjetas adicionales con más estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1.5 transition-all duration-700 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="text-center p-5">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/30">
                  <TrendingUp className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <p className="text-emerald-700 font-bold text-sm mb-3 uppercase tracking-wide">Venta Promedio</p>
                {loading ? (
                  <div className="h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl animate-pulse mx-auto w-4/5 shadow-md"></div>
                ) : (
                  <p className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
                    {formatPrice(stats.averageSale)}
                  </p>
                )}
              </div>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1.5 transition-all duration-700 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="text-center p-5">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/30">
                  <ArrowUpRight className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <p className="text-emerald-700 font-bold text-sm mb-3 uppercase tracking-wide">Venta Máxima</p>
                {loading ? (
                  <div className="h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl animate-pulse mx-auto w-4/5 shadow-md"></div>
                ) : (
                  <p className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
                    {formatPrice(stats.maxSale)}
                  </p>
                )}
              </div>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1.5 transition-all duration-700 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="text-center p-5">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/30">
                  <TrendingDown className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <p className="text-emerald-700 font-bold text-sm mb-3 uppercase tracking-wide">Venta Mínima</p>
                {loading ? (
                  <div className="h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl animate-pulse mx-auto w-4/5 shadow-md"></div>
                ) : (
                  <p className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
                    {formatPrice(stats.minSale)}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;