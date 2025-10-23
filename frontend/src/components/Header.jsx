import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🖼️ Demo avatar photo (same for all)
  const demoAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // simple user icon

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    if (setUser) setUser(null);
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition cursor-pointer"
          >
            My E-Shop
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/cart"
              className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
            >
              Cart
            </Link>

            {user?.token ? (
              <>
                <div className="flex items-center space-x-2">
                  <img
                    src={demoAvatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>

                <button
                  onClick={logout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            type="button"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
            >
              Cart
            </Link>

            {user?.token ? (
              <>
                <div className="flex items-center space-x-3">
                  <img
                    src={demoAvatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
