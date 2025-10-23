import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Cart() {
  const { cart, updateQty, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const formatPrice = (v) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const handleQtyChange = async (item, qty) => {
    try {
      const parsedQty = Math.max(1, Math.floor(Number(qty)));
      const res = await updateQty(item.product, parsedQty);
      showToast(
        res?.success ? "Quantity updated" : "Failed to update quantity",
        res?.success ? "success" : "error"
      );
    } catch {
      showToast("Error updating quantity", "error");
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await removeItem(id);
      showToast(
        res?.success ? "Item removed from cart" : "Failed to remove item",
        res?.success ? "success" : "error"
      );
    } catch {
      showToast("Error removing item", "error");
    }
  };

  const checkout = () => {
    if (!user?.token) {
      showToast("Please login to continue to checkout", "info");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (!cart.length) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-4 text-lg">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            🛍️ Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item, idx) => (
          <div
            key={item.product ?? idx}
            className="bg-white p-4 rounded-lg flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm hover:shadow-md transition"
          >
            {/* Product Image */}
            <img
              src={item.image || "https://via.placeholder.com/120"}
              alt={item.name}
              className="w-28 h-28 sm:w-24 sm:h-24 object-cover rounded-lg"
            />

            {/* Item Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-gray-800 text-lg">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatPrice(item.price)}
              </p>

              {/* Quantity Controls */}
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start items-center gap-2">
                {["-", "+"].map((op) => (
                  <button
                    key={op}
                    onClick={() =>
                      handleQtyChange(
                        item,
                        op === "-" ? item.qty - 1 : item.qty + 1
                      )
                    }
                    className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 transition"
                    type="button"
                  >
                    {op}
                  </button>
                ))}

                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => handleQtyChange(item, e.target.value)}
                  className="w-16 text-center border border-gray-300 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={() => handleRemove(item.product)}
                  className="text-red-600 hover:text-red-700 hover:underline ml-2"
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Subtotal (per item) */}
            <div className="text-center sm:text-right font-semibold text-gray-800">
              {formatPrice(item.price * item.qty)}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <aside className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-4">
        <h4 className="font-semibold text-gray-800 text-lg border-b pb-2">
          Order Summary
        </h4>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Items</span>
            <span>{cart.reduce((s, i) => s + Number(i.qty || 0), 0)}</span>
          </div>
          <div className="flex justify-between text-gray-800 font-medium">
            <span>Total</span>
            <span className="font-bold text-blue-700">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        <button
          onClick={checkout}
          className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium text-sm sm:text-base"
        >
          Proceed to Checkout
        </button>
      </aside>
    </div>
  );
}
