"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Settings,
  Home,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import CartSidebar from "@/components/cart-sidebar/cart-sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const cartItems = useSelector((state: RootState) => state.CartSlice.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  const checkAuthStatus = async () => {
    // First check localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("auth-token");

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        setUserData(user);
        setIsLoggedIn(true);
        return;
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("auth-token");
      }
    }

    // If no localStorage, try to fetch from API (in case of cookie-only auth)
    try {
      const response = await fetch("/api/user-summary", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setIsLoggedIn(true);
        // Store in localStorage for faster subsequent checks
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API
      await fetch("/api/logout", {
        method: "POST",
      });

      // Clear local storage
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");

      // Update state
      setIsLoggedIn(false);
      setUserData(null);
      setShowUserDropdown(false);

      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-black">
            Acme Electronic Hub
          </Link>

          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <Link
              href="/"
              className={`hover:text-blue-600 transition ${
                pathname === "/" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`hover:text-blue-600 transition ${
                pathname === "/about" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              About
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className={`hover:text-blue-600 transition ${
                  pathname === "/dashboard" ? "text-blue-600 font-semibold" : ""
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center justify-between gap-4 relative">
            {/* Cart Button */}
            <button
              type="button"
              aria-label="View Cart"
              onClick={() => setIsSidebarOpen(true)}
              className="relative text-gray-800 hover:text-blue-600 transition"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                aria-label="User Menu"
                onClick={handleUserIconClick}
                className={`relative text-gray-800 hover:text-blue-600 transition ${
                  isLoggedIn ? "p-1" : ""
                }`}
              >
                <User size={22} />
                {isLoggedIn && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {/* Dropdown Menu (only show when logged in) */}
              {isLoggedIn && showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded-lg z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {userData?.firstName?.charAt(0)}
                        {userData?.lastName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userData?.firstName} {userData?.lastName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {userData?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/dashboard");
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition flex items-center gap-3"
                    >
                      <Package size={18} className="text-blue-600" />
                      <div>
                        <p className="font-medium">My Orders</p>
                        <p className="text-xs text-gray-500">
                          Track and manage orders
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        router.push("/profile");
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition flex items-center gap-3"
                    >
                      <Settings size={18} className="text-blue-600" />
                      <div>
                        <p className="font-medium">Edit Profile</p>
                        <p className="text-xs text-gray-500">
                          Update your information
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t py-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Login Prompt (show when not logged in and clicking user icon) */}
              {!isLoggedIn && showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded-lg z-50 overflow-hidden">
                  <div className="p-4">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <User size={32} className="text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Welcome Back!
                      </h3>
                      <p className="text-sm text-gray-600">
                        Sign in to access your account
                      </p>
                    </div>

                    <Link
                      href="/login"
                      onClick={() => setShowUserDropdown(false)}
                      className="block w-full text-center bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium mb-3"
                    >
                      Login
                    </Link>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Don't have an account?{" "}
                        <Link
                          href="/signup"
                          onClick={() => setShowUserDropdown(false)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Sign up
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <CartSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
