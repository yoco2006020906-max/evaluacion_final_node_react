import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Package, ArrowRight, ChevronDown } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Logo y descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  TechStore
                </h2>
                <p className="text-slate-400 text-xs">Premium Technology</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4 text-sm">
              La tienda de tecnología más confiable. Productos premium con garantía total.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-500" />
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Sobre Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-cyan-500" />
              Información
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Política de Devoluciones</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-500" />
              Contacto
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-400">Calle 10 #20-30<br />Medellín, Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span className="text-sm text-slate-400">+57 300 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span className="text-sm text-slate-400">info@techstore.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-8 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-slate-900" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400">© {new Date().getFullYear()} TechStore</p>
                <p className="text-xs text-slate-500">Todos los derechos reservados</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Métodos de Pago
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Envíos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;