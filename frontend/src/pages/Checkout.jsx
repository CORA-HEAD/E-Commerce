import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Checkout() {
  const { cart, subtotal } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  const formatPrice = (v) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!user?.token) {
      showToast("Please login to place an order", "info");
      navigate("/login");
      return false;
    }
    if (!cart.length) {
      showToast("Your cart is empty", "info");
      return false;
    }
    if (Object.values(form).some((f) => !f.trim())) {
      showToast("Please complete the shipping address", "info");
      return false;
    }
    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        items: cart.map(({ product, name, price, qty, image }) => ({
          product,
          name,
          price: Number(price),
          qty: Number(qty),
          image,
        })),
        shippingAddress: form,
      };

      const res = await API.post("/stripe/create-checkout-session", payload);

      if (res.data?.url) {
        showToast("Redirecting to payment...", "info");
        window.location.href = res.data.url;
      } else {
        showToast("Failed to start checkout", "error");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      showToast(
        err?.response?.data?.message || "Unable to start checkout",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Checkout</h2>

      <form
        onSubmit={handleCheckout}
        className="bg-white rounded-lg shadow-sm p-6 space-y-4"
      >
        <h3 className="text-lg font-medium text-gray-800">Shipping Address</h3>

        {["address", "city", "postalCode", "country"].map((field) => (
          <div
            key={field}
            className={field === "postalCode" ? "grid grid-cols-2 gap-4" : ""}
          >
            {field === "postalCode" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Redirecting…" : `Pay ${formatPrice(subtotal)}`}
        </button>
      </form>
    </div>
  );
}
