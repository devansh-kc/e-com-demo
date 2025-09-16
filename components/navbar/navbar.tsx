"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import CartSidebar from "@/components/cart-sidebar/cart-sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const cartItems = useSelector((state: RootState) => state.CartSlice.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-black">
            Acme Electronic Hub
          </Link>

          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition">
              About
            </Link>
          </nav>

          <div className="flex items-center justify-between gap-4 relative">
            {/* Admin Login Button */}

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

            <div className="relative">
              <Link
                type="button"
                aria-label="User Menu"
                href={"/login"}
                // onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="text-gray-800 hover:text-blue-600 transition"
              >
                <User size={22} />
              </Link>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50 overflow-hidden">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Hello, <strong>Vivek Zala</strong>
                  </div>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Edit Profile
                  </button>
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
