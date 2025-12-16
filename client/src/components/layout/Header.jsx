import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, ShoppingBag, Package, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const isAdmin = user?.role?.name === 'admin' || user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-gray-900 text-white shadow-lg sticky top-0 z-50 backdrop-blur-xl border-b border-emerald-500/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2 hover:scale-105 transition-all duration-300">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300 border-2 border-white/20">
              <ShoppingBag className="w-4 h-4 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
                TechStore
              </h1>
              <p className="text-emerald-300 text-xs font-medium tracking-wide">Premium</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="relative group px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-500/20 hover:backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-emerald-500/25 shadow-md">
              Inicio
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/products" className="px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-500/20 hover:backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-emerald-500/25 shadow-md">
                  Productos
                </Link>
                <Link to="/my-orders" className="px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-500/20 hover:backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-emerald-500/25 shadow-md flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Pedidos
                </Link>
                {isAdmin && (
                  <>
                    <Link to="/admin" className="relative px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-amber-500/20 to-amber-400/20 border border-amber-400/50 hover:bg-amber-500/30 shadow-amber-500/25 transition-all duration-300">
                      <LayoutDashboard className="w-3.5 h-3.5 inline mr-1.5" />
                      Admin
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-gray-900 text-xs font-black px-2 py-0.5 rounded-lg shadow-md">ADMIN</span>
                    </Link>
                    <Link to="/chat" className="px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-500/20 hover:backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-emerald-500/25 shadow-md">
                      Chat
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="group relative p-2 rounded-xl bg-white/10 hover:bg-emerald-500/30 backdrop-blur-sm border border-white/20 hover:border-emerald-400/50 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110">
                  <ShoppingCart className="w-5 h-5 text-emerald-300 group-hover:text-white" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg drop-shadow-lg animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-emerald-500/30 shadow-lg hover:shadow-emerald-500/25 hover:bg-white/20 transition-all duration-300">
                  <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm hidden xl:block">{user?.name || user?.email}</span>
                  {isAdmin && (
                    <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-black text-xs rounded-lg shadow-md uppercase tracking-wider">Admin</span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 backdrop-blur-sm border border-white/20 hover:border-rose-400/50 shadow-lg hover:shadow-rose-500/25 transition-all duration-300 hover:scale-110 group"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5 text-emerald-300 group-hover:text-rose-300 transition-colors" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 bg-white/10 backdrop-blur-sm text-white font-bold text-sm rounded-xl border-2 border-emerald-500/50 hover:bg-emerald-500/20 hover:border-emerald-400/75 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-black text-sm rounded-xl shadow-lg hover:shadow-emerald-500/50 hover:scale-105 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-white/10 backdrop-blur-sm hover:bg-emerald-500/30 rounded-xl border border-white/20 hover:border-emerald-400/50 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-emerald-500/30 mt-3 pt-4 backdrop-blur-xl rounded-xl bg-white/5">
            <nav className="space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:translate-x-2 font-semibold text-base shadow-md"
              >
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-all" />
                Inicio
              </Link>
              
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:translate-x-2 font-semibold text-base shadow-md"
              >
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-all" />
                Productos
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 relative hover:bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:translate-x-2 font-semibold text-base shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    Carrito
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-bounce">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:translate-x-2 font-semibold text-base shadow-md"
                  >
                    <Package className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                    Mis Pedidos
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/20 border border-amber-400/50 hover:bg-amber-500/40 shadow-amber-500/25 font-semibold text-base relative shadow-md"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      Panel Admin
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-gray-900 text-xs font-black px-2 py-1 rounded-lg shadow-md">ADMIN</span>
                    </Link>
                  )}
                  
                  <div className="border-t border-emerald-500/30 pt-3 mt-3 bg-white/5 backdrop-blur-sm rounded-xl p-3">
                    <div className="flex items-center gap-3 mb-3 p-3 bg-emerald-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/50">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block">{user?.name || user?.email}</span>
                        {isAdmin && (
                          <span className="bg-amber-500 text-gray-900 text-xs font-black px-2 py-0.5 rounded-lg uppercase mt-1 inline-block">Admin</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-rose-500/20 to-red-500/20 hover:from-rose-500/40 hover:to-red-500/40 backdrop-blur-sm border-2 border-rose-500/50 hover:border-rose-400/75 rounded-xl font-bold text-sm shadow-lg hover:shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-3 bg-white/10 backdrop-blur-sm text-white font-bold text-sm rounded-xl border-2 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400/75 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300 text-center"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-black text-sm rounded-xl shadow-lg hover:shadow-emerald-500/50 hover:scale-105 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 text-center"
                  >
                    Registrarse Gratis
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;