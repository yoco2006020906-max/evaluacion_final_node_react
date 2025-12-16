import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, HelpCircle, BookOpen } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/admin/products',
      icon: Package,
      label: 'Productos'
    },
    {
      path: '/admin/orders',
      icon: ShoppingCart,
      label: 'Pedidos'
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Usuarios'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-56 bg-gradient-to-b from-emerald-900 via-emerald-800 to-gray-900 h-screen flex flex-col overflow-hidden shadow-lg border-r border-emerald-500/30 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-emerald-500/30">
        <div className="flex items-center gap-2 mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-emerald-500/30">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-lg">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black bg-gradient-to-r from-emerald-300 via-white to-emerald-200 bg-clip-text text-transparent drop-shadow-lg">
              Admin Panel
            </h2>
            <p className="text-emerald-200 text-xs font-medium">Gestión Total</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-x-1 hover:scale-[1.02] relative overflow-hidden
                  ${active 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50 border-r-4 border-white/50' 
                    : 'text-emerald-300 hover:text-white bg-white/10 hover:bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50'
                  }
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all ${active ? 'bg-white/20 backdrop-blur-sm shadow-md' : 'group-hover:bg-white/30'}`}>
                  <Icon className={`w-4 h-4 transition-transform ${active ? 'group-hover:scale-110' : 'group-hover:scale-110'}`} />
                </div>
                <span className="font-bold text-sm tracking-wide flex-1">{item.label}</span>
                {active && (
                  <div className="absolute right-2 w-1.5 h-12 bg-gradient-to-b from-white/50 to-transparent rounded-l-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer - Información adicional */}
      <div className="flex-1 flex flex-col justify-end p-4 border-t border-emerald-500/30">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 group">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg border-2 border-emerald-400/50 group-hover:bg-emerald-500/30 transition-all">
              <HelpCircle className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-200 mb-0.5">Soporte & Ayuda</h3>
              <p className="text-emerald-300 text-xs">Documentación completa disponible</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-white/30 group-hover:shadow-emerald-500/50">
            <BookOpen className="w-3.5 h-3.5" />
            Ver Documentación
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;