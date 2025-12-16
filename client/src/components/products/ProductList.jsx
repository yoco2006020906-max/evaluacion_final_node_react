import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';
import { useEffect } from 'react';

const ProductList = ({ products, onAddToCart, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="bg-gray-300 h-40"></div>
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <PackageOpen className="w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No se encontraron productos
        </h3>
        <p className="text-sm text-gray-500">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;