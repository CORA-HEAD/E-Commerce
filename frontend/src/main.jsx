import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter  } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import App from './App';
import './index.css';
import { ToastProvider } from "./contexts/ToastContext";
ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter >
    <AuthProvider>
      <CartProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </HashRouter >
);
