// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const SESSION_KEY = "cart";

export function CartProvider({ children }) {
  const { user } = useAuth() || {};
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Save to sessionStorage whenever cart changes
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(cart));
  }, [cart]);

  //Sync cart from server when user logs in
  useEffect(() => {
    if (!user?.token) return;
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/cart");
        if (isMounted && data) setCart(data);
      } catch (err) {
        console.error("Cart sync error:", err);
        setError("Failed to sync cart with server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => (isMounted = false);
  }, [user?.token]);

  const findItemIndex = (productId) =>
    cart.findIndex((item) => String(item.product) === String(productId));

  //Add to Cart
  const addToCart = async (productId, qty = 1, meta = {}) => {
    setError(null);

    // Update locally first
    setCart((prev) => {
      const idx = findItemIndex(productId);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].qty = Math.min(
          meta.countInStock ?? Infinity,
          (copy[idx].qty || 0) + qty
        );
        return copy;
      }
      return [...prev, { product: productId, qty, ...meta }];
    });

    // If guest, stop here
    if (!user?.token) return { success: true, source: "session" };

    try {
      const { data } = await API.post("/cart/add", { productId, qty });
      if (data) setCart(data);
      return { success: true, data };
    } catch (err) {
      console.error("addToCart error:", err);
      setError("Failed to add item to server cart.");
      return { success: false, error: err };
    }
  };

  //Update quantity
  const updateQty = async (productId, qty) => {
    setError(null);
    setCart((prev) =>
      prev.map((item) =>
        String(item.product) === String(productId) ? { ...item, qty } : item
      )
    );

    if (!user?.token) return { success: true, source: "session" };

    try {
      const { data } = await API.put(`/cart/item/${productId}`, { qty });
      if (data) setCart(data);
      return { success: true, data };
    } catch (err) {
      console.error("updateQty error:", err);
      setError("Failed to update quantity.");
      return { success: false, error: err };
    }
  };

  //Remove item
  const removeItem = async (productId) => {
    setError(null);
    setCart((prev) => prev.filter((i) => String(i.product) !== String(productId)));

    if (!user?.token) return { success: true, source: "session" };

    try {
      const { data } = await API.delete(`/cart/item/${productId}`);
      if (data) setCart(data);
      return { success: true, data };
    } catch (err) {
      console.error("removeItem error:", err);
      setError("Failed to remove item.");
      return { success: false, error: err };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setError(null);
    setCart([]);
    sessionStorage.removeItem(SESSION_KEY);

    if (!user?.token) return { success: true, source: "session" };

    try {
      const { data } = await API.delete("/cart");
      if (data) setCart(data);
      return { success: true, data };
    } catch (err) {
      console.error("clearCart error:", err);
      setError("Failed to clear cart.");
      return { success: false, error: err };
    }
  };

  //Derived values
  const itemCount = useMemo(() => cart.reduce((sum, i) => sum + Number(i.qty || 0), 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.qty * (i.price || 0), 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
