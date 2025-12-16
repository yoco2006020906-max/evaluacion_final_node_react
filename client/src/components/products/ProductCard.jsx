import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { useAuth } from '../../hooks/useAuth';

const ProductCard = ({ product, onAddToCart }) => {
  const { _id: id, nombre, precio, imagen, descripcion, stock, categoria } = product;
  const { isAuthenticated } = useAuth()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card hover className="group overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-500 border border-gray-200 rounded-xl h-full max-w-sm mx-auto">
      {/* Imagen del producto - Responsive */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 h-40 sm:h-44 md:h-48">
        <img
          src={imagen || 'https://mkgabinet.com/wp-content/uploads/2022/07/caracteristicas-beneficios-producto-mejorar-ventas.jpg'}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge de categoría */}
        {categoria && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
            {categoria}
          </div>
        )}

        {/* Badge de stock bajo */}
        {stock < 5 && stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
            {stock} left
          </div>
        )}

        {/* Sin stock */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center">
            <span className="text-white text-base font-bold px-4 py-2 rounded-lg bg-red-600/50 backdrop-blur-sm">
              AGOTADO
            </span>
          </div>
        )}

        {/* Botón de vista rápida - Responsive */}
        <Link
          to={`/products/${id}`}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white shadow-lg rounded-xl p-2 hover:scale-110"
        >
          <Eye className="w-4 h-4 text-emerald-600" />
        </Link>
      </div>

      {/* Información del producto - Responsive */}
      <div className="p-3 sm:p-4">
        {/* Nombre */}
        <Link to={`/products/${id}`}>
          <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 leading-tight hover:text-emerald-600 transition-colors line-clamp-2">
            {nombre}
          </h3>
        </Link>

        {/* Descripción */}
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {descripcion}
        </p>

        {/* Precio y acciones - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex-1">
            <p className="text-lg sm:text-xl font-black text-emerald-600 mb-0.5">
              {formatPrice(precio)}
            </p>
            {stock > 0 && (
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {stock} disponibles
              </p>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={stock === 0 || !isAuthenticated}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
            {stock === 0 ? 'Agotado' : 'Agregar'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;