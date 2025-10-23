// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/**
 * Simple AuthContext
 * - Reads token & name from localStorage on init
 * - Exposes login/register helpers that call backend and set user
 * - Exposes logout which clears state + localStorage
 *
 * Note: API axios instance should already attach Authorization header from localStorage token.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");
      return token ? { token, name } : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // keep localStorage in sync with user state
    try {
      if (user?.token) {
        localStorage.setItem("token", user.token);
        localStorage.setItem("name", user.name);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
      }
    } catch (e) {
      console.error("AuthContext localStorage sync failed", e);
    }
  }, [user]);

  const login = async ({ email, password }) => {
    const res = await API.post("/auth/login", { email, password });
    // expect res.data = { token, name }
    const u = { token: res.data.token, name: res.data.name };
    setUser(u);
    return u;
  };

  const register = async ({ name, email, password }) => {
    const res = await API.post("/auth/register", { name, email, password });
    const u = { token: res.data.token, name: res.data.name };
    setUser(u);
    return u;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
    } catch {}
    // optional: call backend logout if you have one
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
