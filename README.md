# E-Commerce Web App

This is a **full-stack e-commerce web application** built with **React** on the frontend and **Node.js + Express** on the backend. The app allows users to browse products, manage a shopping cart, register/login, and checkout using **Stripe payment integration**.  

The project is designed with **real-world functionality** in mind and is responsive, user-friendly, and modular for scalability.

---

## Features

### User Authentication
- Register and login functionality.
- JWT-based authentication stored in **localStorage**.
- Toast notifications for success/error messages.

### Product Management
- Browse all products on the home page.
- View individual product details with images, description, and stock info.
- Dynamic quantity selection for adding products to cart.

### Cart Functionality
- Add/remove products to/from the cart.
- Update quantity with buttons or manual input.
- Display subtotal and item count in real-time.
- Persist cart for logged-in users.

### Checkout & Payment
- Stripe integration for secure checkout.
- Shipping address form with validation.
- Redirect to Stripe hosted checkout session.
- Confirmation page after successful payment with order summary.

### UI & UX
- Responsive layout using **Tailwind CSS**.
- Reusable components for product cards, buttons, and forms.
- Loading states and error handling for smooth experience.
- Toast notifications for user feedback.

---

## Tech Stack

**Frontend:**
- React
- React Router v6
- Context API for state management (Cart, Auth, Toast)
- Tailwind CSS for styling

**Backend:**
- Node.js + Express
- MongoDB (or MySQL/PostgreSQL if configured)
- JWT for authentication
- Stripe API for payments

**Tools & Libraries:**
- Axios for API calls
- React Hooks for state and effect management
- Browser localStorage for persisting auth data
- Stripe SDK for payment processing

---

## Folder Structure

```text
src/
├─ api/            # Axios API instance
├─ components/     # Reusable components (ProductCard, etc.)
├─ contexts/       # Auth, Cart, Toast context providers
├─ pages/          # React pages (Home, Login, Register, Cart, Checkout, ProductDetails, OrderSuccess)
├─ App.jsx         # Main React app routing
├─ index.jsx       # Entry point
