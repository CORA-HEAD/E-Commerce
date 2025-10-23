// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    setProduct(null);
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setQty(res.data.countInStock > 0 ? 1 : 0);
      })
      .catch(() => {
        showToast("Failed to load product.", "error");
      })
      .finally(() => setLoading(false));
  }, [id, showToast]);

  // Dynamic document title
  useEffect(() => {
    if (product?.name) document.title = `${product.name} - MyStore`;
  }, [product]);

  // Add to cart handler
  const handleAdd = async () => {
    if (!product) return;

    if (!user?.token) {
      showToast("Please login to add items to cart", "info");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (product.countInStock === 0) {
      showToast("Product is out of stock.", "error");
      return;
    }

    setAdding(true);
    try {
      const meta = {
        name: product.name,
        price: product.price,
        image: product.image,
      };

      const res = await addToCart(product._id || product.id, qty, meta);

      if (res?.success) {
        showToast("Added to cart!", "success");
        navigate("/cart");
      } else {
        const msg =
          res?.error?.response?.data?.message ||
          res?.data?.message ||
          "Could not add to cart.";
        showToast(msg, "error");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Unable to add to cart.";
      showToast(msg, "error");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg animate-pulse">
        Loading product...
      </div>
    );

  if (!product)
    return (
      <div className="max-w-4xl mx-auto py-10 text-center text-gray-600">
        Product not found.{" "}
        <Link to="/" className="text-blue-600 underline">
          Back to products
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src={product.image || "https://via.placeholder.com/800x600"}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-800">
            {product.name}
          </h1>
          <p className="text-gray-500 mt-2">{product.description}</p>

          <p className="mt-4 text-3xl font-bold text-blue-600">
            ${Number(product.price).toFixed(2)}
          </p>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center border rounded-md px-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="px-3 py-1 text-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                −
              </button>

              <input
                type="number"
                min="1"
                max={product.countInStock}
                value={qty}
                disabled={product.countInStock === 0}
                onChange={(e) => {
                  const v = Number(e.target.value) || 1;
                  setQty(
                    Math.min(Math.max(1, Math.floor(v)), product.countInStock)
                  );
                }}
                className="w-16 text-center outline-none px-2 py-1"
              />

              <button
                onClick={() =>
                  setQty((q) => Math.min(product.countInStock, q + 1))
                }
                className="px-3 py-1 text-lg cursor-pointer"
                type="button"
              >
                +
              </button>
            </div>

            <span className="text-sm text-gray-600">
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : "Out of stock"}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            disabled={adding || product.countInStock === 0}
            aria-disabled={adding || product.countInStock === 0}
            className={`mt-6 w-full py-2 rounded-md text-white text-lg font-medium transition
              ${
                adding || product.countInStock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            type="button"
          >
            {adding ? "Adding..." : "🛒 Add to Cart"}
          </button>

          {/* Product ID */}
          <div className="mt-6 text-sm text-gray-500 border-t pt-3">
            <span className="font-medium">Product ID:</span>{" "}
            {product._id || product.id}
          </div>
        </div>
      </div>
    </div>
  );
}
