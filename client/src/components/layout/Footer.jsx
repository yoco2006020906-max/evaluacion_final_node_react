import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Package, ArrowRight, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white mt-16">
      {/* Sección superior con degradado */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">¿Listo para comprar?</h3>
                <p className="text-emerald-100 text-sm">Descubre nuestra colección premium</p>
              </div>
            </div>
            <Link 
              to="/products"
              className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              Ver productos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal del footer */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  TechStore
                </h2>
                <p className="text-emerald-400 text-xs font-semibold">Premium Technology</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              La tienda de tecnología más confiable. Productos premium con garantía total y envíos seguros.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:scale-105">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:scale-105">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:scale-105">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white">
                Navegación
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Sobre Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Información legal */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white">
                Legal
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white">
                Contacto
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Dirección</p>
                  <span className="text-sm text-gray-300">Calle 10 #20-30<br />Medellín, Colombia</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Teléfono</p>
                  <span className="text-sm text-gray-300">+57 300 123 4567</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Email</p>
                  <span className="text-sm text-gray-300">info@techstore.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">© {new Date().getFullYear()} TechStore</p>
                <p className="text-xs text-gray-500">Todos los derechos reservados</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
                Métodos de Pago
              </a>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
                Envíos
              </a>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
                Soporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;