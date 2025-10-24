# 🛍️ MERN E-Commerce (Stripe Integration)

A simple, modern **E-Commerce app** built for assessment/demo purposes.  
It supports user authentication, product browsing, cart management, checkout, and **Stripe test payments**, all with a responsive UI built in **React + Tailwind CSS**.

---

## ⚙️ Tech Stack

### **Frontend**
- React (Vite)
- React Router DOM
- Context API (Auth, Cart, Toast)
- Tailwind CSS
- Stripe Checkout (Test Mode)
- Deployed on Vercel

### **Backend**
- Node.js / Express
- MongoDB + Mongoose
- JWT Authentication
- Stripe API (Test Mode)
- dotenv, cors, bcrypt, jsonwebtoken
- Deployed on Render

---

## 📁 Project Structure

```
techcurators-ecommerce/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── stripe.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── stripeController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── stripe.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/api.js
    │   ├── contexts/
    │   │   ├── AuthContext.jsx
    │   │   ├── CartContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   └── OrderSuccess.jsx
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   └── Toast.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── .env
```

---

## ⚡️ Setup & Installation

### 1️⃣ Clone Repo
```bash
git clone https://github.com/CORA-HEAD/E-Commerce.git
cd techcurators-ecommerce
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

#### Create `.env` file in `backend/`
```env
PORT=
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
CLIENT_URL=
JWT_SECRET=yourSecretKey

STRIPE_SECRET_TEST= YOUR API
#### Run the backend
```bash
npm run dev
```
Backend runs on → [http://localhost:5001](http://localhost:5001)
Production Backend: https://e-commerce-8ys8.onrender.com

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

#### Create `.env` file in `frontend/`
```env
VITE_API_URL=http://localhost:5001/api
```

#### Run the frontend
```bash
npm run dev
```
Frontend runs on → [http://localhost:5173](http://localhost:5173)
Production Frontend: https://your-frontend-url.vercel.app

---

## 💳 Stripe Test Mode (No Webhooks)

Stripe is configured in **test mode** — you can simulate payments easily.

#### Test Card
```
Card Number: 4242 4242 4242 4242
Exp: any future date (e.g., 12/34)
CVC: any 3 digits (e.g., 123)
ZIP: any 5 digits (e.g., 12345)
```

#### Payment Flow
1. Add products to cart  
2. Proceed to checkout  
3. Enter shipping info  
4. Click “Pay” — Stripe Checkout opens  
5. Complete test payment  
6. Redirect to `/order-success`  
7. Backend confirms payment and saves order in MongoDB  

---

## Key Features

✅ User Authentication (JWT)  
✅ Product Listing & Details  
✅ Persistent Cart (DB + Context)  
✅ Secure Stripe Payment (Test Mode)  
✅ Toast Notifications for Feedback  
✅ Responsive (Mobile + Desktop)  
✅ Order Confirmation & Stock Update  
✅ MongoDB Atlas for Database

---

##Environment Variables Summary

| Variable | Description |
|-----------|-------------|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend base URL |
| `JWT_SECRET` | Secret key for JWT tokens |
| `STRIPE_SECRET_TEST` | Stripe test secret key (starts with `sk_test_`) |

---

## Example API Routes
### Authentication Routes — `/api/auth`
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user and receive JWT |

### Product Routes — `/api/products`
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/products` | Fetch all available products |

### Cart Routes — `/api/cart`
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/cart/add` | Add an item to the user’s cart |

### Stripe Payment Routes — `/api/stripe`
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/stripe/create-checkout-session` | Create Stripe Checkout Session |
| `GET` | `/api/stripe/confirm/:sessionId` | Confirm payment and create order in DB |

### Order Routes — `/api/orders`
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/orders` | Retrieve user’s orders (requires JWT auth) |
