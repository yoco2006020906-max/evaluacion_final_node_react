import React, { useState } from 'react';
import { ShoppingBag, Truck, Tag, CreditCard, Shield, Clock, ArrowRight, X } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';

const CartSummary = ({ subtotal, onCheckout, loading = false }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Cálculos
  const shipping = subtotal > 100000 ? 0 : 10000;
  const tax = subtotal * 0.19;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  const handleApplyDiscount = () => {
    console.log('Aplicar descuento:', discountCode);
    setShowDiscountInput(false);
  };

  return (
    <Card className="lg:sticky lg:top-24">
      <div className="space-y-4">
        {/* Título */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <div className="p-1.5 bg-cyan-500 rounded-lg">
            <ShoppingBag className="w-4 h-4 text-slate-900" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Resumen del Pedido
          </h2>
        </div>

        {/* Desglose de precios */}
        <div className="space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-sm font-semibold text-slate-700">
              Subtotal
            </span>
            <span className="text-base font-bold text-slate-900">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Envío */}
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Envío</span>
              </div>
              <span className="text-base font-bold">
                {shipping === 0 ? (
                  <span className="text-cyan-600">¡GRATIS!</span>
                ) : (
                  <span className="text-slate-900">{formatPrice(shipping)}</span>
                )}
              </span>
            </div>

            {/* Shipping progress */}
            {shipping > 0 && subtotal < 100000 && (
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1.5">
                  ¡Faltan {formatPrice(100000 - subtotal)} para envío gratis!
                </p>
                <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((subtotal / 100000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* IVA */}
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-sm font-semibold text-slate-700">
              IVA (19%)
            </span>
            <span className="text-base font-bold text-slate-900">
              {formatPrice(tax)}
            </span>
          </div>

          {/* Descuento */}
          {discount > 0 && (
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Descuento</span>
              </div>
              <span className="text-base font-bold text-green-600">-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        {/* Código de descuento */}
        <div className="pt-2 border-t border-slate-200">
          <button
            onClick={() => setShowDiscountInput(!showDiscountInput)}
            className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">Código Promocional</span>
            </div>
            {showDiscountInput ? (
              <X className="w-3.5 h-3.5 text-slate-600" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>
          
          {showDiscountInput && (
            <div className="flex gap-2 mt-2">
              <Input
                name="discount"
                placeholder="Código"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyDiscount}
              >
                Aplicar
              </Button>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex justify-between items-center mb-3 p-3 bg-slate-900 rounded-lg">
            <span className="text-sm font-bold text-white uppercase">
              Total
            </span>
            <span className="text-xl font-black text-cyan-400">
              {formatPrice(total)}
            </span>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={onCheckout}
            loading={loading}
            className="h-11 group"
          >
            <span className="flex items-center justify-center gap-2 text-sm font-bold">
              {loading ? 'Procesando...' : 'Proceder al Pago'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>

        {/* Información adicional */}
        <div className="pt-3 border-t border-slate-200">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="p-1.5 bg-cyan-500 rounded-md">
                <CreditCard className="w-3.5 h-3.5 text-slate-900" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="p-1.5 bg-cyan-500 rounded-md">
                <Truck className="w-3.5 h-3.5 text-slate-900" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Envío en 2-5 días hábiles</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="p-1.5 bg-cyan-500 rounded-md">
                <Shield className="w-3.5 h-3.5 text-slate-900" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Garantía de satisfacción</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartSummary;