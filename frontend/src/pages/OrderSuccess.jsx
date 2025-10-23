import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const calledRef = useRef(false); // ensures single API call

  // Extract session ID and confirm payment
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sid = params.get("session_id");
    setSessionId(sid);

    if (!sid) {
      showToast("No session id provided", "error");
      setLoading(false);
      return;
    }

    if (calledRef.current) return;
    calledRef.current = true;

    const confirmPayment = async () => {
      try {
        const res = await API.get(`/stripe/confirm/${sid}`);
        setOrder(res.data);

        // clear cart after successful order
        if (clearCart) {
          try { await clearCart(); } catch {}
        }

        showToast("Order confirmed — thank you!", "success");
      } catch (err) {
        console.error("confirm error", err);
        showToast(err?.response?.data?.message || "Unable to confirm order", "error");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [location.search, clearCart, showToast]);

  // Retry confirmation
  const handleRetry = () => {
    calledRef.current = false;
    setLoading(true);
    navigate(location.pathname + location.search, { replace: true });
  };

  // Copy session ID to clipboard
  const handleCopy = async () => {
    if (!sessionId) return;
    try {
      setCopying(true);
      await navigator.clipboard.writeText(sessionId);
      showToast("Session ID copied to clipboard", "success");
    } catch {
      showToast("Failed to copy session ID", "error");
    } finally {
      setCopying(false);
    }
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4" />
          <div className="text-gray-600">Confirming payment…</div>
        </div>
      </div>
    );
  }

  // Error state if order not available
  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-2">Unable to confirm payment</h2>
        <p className="text-gray-600 mb-4">
          If you were charged, contact support and provide your session ID below.
        </p>

        {sessionId && (
          <div className="flex items-center gap-2 mb-4">
            <div className="break-all bg-gray-50 p-2 rounded-md text-sm">{sessionId}</div>
            <button
              onClick={handleCopy}
              disabled={copying}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              {copying ? "Copying…" : "Copy"}
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Retry confirmation
          </button>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-2">Order Confirmed</h2>
      <p className="text-sm text-gray-600 mb-4">
        Thank you! Your order has been placed successfully.
      </p>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-gray-500">Order ID</div>
            <div className="font-medium">{order._id}</div>
          </div>
        </div>

        <div className="border-t pt-3">
          {order.orderItems.map((item) => (
            <div
              key={item.product || item._id}
              className="flex justify-between py-2 border-b last:border-b-0"
            >
              <div className="truncate">
                {item.name} × {item.qty}
              </div>
              <div className="font-medium">${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
}
