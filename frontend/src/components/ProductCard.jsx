import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="w-full h-52 object-cover"
        />
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-gray-500 mt-1 text-sm line-clamp-2">
          {product.description || 'No description available.'}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-blue-600">
            ${product.price?.toFixed(2)}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-950 transition"
          >
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}
