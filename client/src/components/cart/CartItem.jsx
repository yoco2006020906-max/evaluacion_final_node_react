import React from 'react';
import { Trash2, Plus, Minus, Package, ShoppingCart } from 'lucide-react';
import Button from '../common/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove, key }) => {
  const { _id, nombre, precio, imagen, quantity, stock } = item;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleIncrement = () => {
    if (quantity < stock) {
      onUpdateQuantity(_id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(_id, quantity - 1);
    }
  };

  const subtotal = precio * quantity;

  return (
    <div
      key={key}
      className="group relative bg-white backdrop-blur-xl border-2 border-slate-200 rounded-xl p-4 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all duration-300"
    >
      <div className="relative flex gap-4 items-center">
        {/* Imagen del producto */}
        <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-lg border-2 border-slate-200">
          <img
            src={imagen || 'https://via.placeholder.com/400?text=Producto'}
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400?text=Producto';
            }}
          />
          <div className="absolute top-1 right-1 bg-slate-900 text-white px-2 py-0.5 rounded-md text-xs font-bold">
            x{quantity}
          </div>
        </div>

        {/* Información del producto */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Nombre y precio */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">
              {nombre}
            </h3>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500 rounded-lg">
                <ShoppingCart className="w-4 h-4 text-slate-900" />
              </div>
              <p className="text-xl font-bold text-slate-900">
                {formatPrice(precio)}
              </p>
            </div>
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white shadow-md rounded-lg border-2 border-slate-200 overflow-hidden">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-2 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
              >
                <Minus className="w-4 h-4 text-slate-600" />
              </button>

              <span className="px-6 py-2 bg-slate-900 text-white font-bold text-lg min-w-[4rem] text-center">
                {quantity}
              </span>

              <button
                onClick={handleIncrement}
                disabled={quantity >= stock}
                className="p-2 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
              >
                <Plus className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {quantity >= stock && (
              <div className="px-3 py-1.5 bg-orange-100 rounded-lg border border-orange-300 text-xs font-bold text-orange-700">
                Stock máximo
              </div>
            )}
          </div>
        </div>

        {/* Subtotal y eliminar */}
        <div className="flex flex-col items-end justify-between gap-3 text-right">
          {/* Eliminar */}
          <button
            onClick={() => onRemove(_id)}
            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 hover:border-red-400 transition-all"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>

          {/* Subtotal */}
          <div className="space-y-1">
            <p className="text-xs text-slate-600 font-semibold uppercase">Subtotal</p>
            <p className="text-2xl font-black text-slate-900">
              {formatPrice(subtotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;