"use client";

import Image from "next/image";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  image: string;
  variant: string;
  price: number;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  isEmpty?: boolean;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems = [],
  isEmpty = false,
}: Readonly<CartSidebarProps>) {
  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 w-[90%] sm:w-[400px] h-full bg-white text-black z-50 shadow-xl transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button onClick={onClose} className="hover:text-red-600 transition">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <ShoppingCart size={50} />
            <p className="mt-4 font-semibold">Your cart is empty.</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 mb-6 bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.variant}</p>
                </div>
                <div className="flex items-center gap-2 border border-gray-300 px-2 py-1 rounded-full text-sm">
                  <button className="hover:text-blue-600">−</button>
                  <span>{item.quantity}</span>
                  <button className="hover:text-blue-600">+</button>
                </div>
                <span className="text-sm font-semibold">
                  ${item.price.toFixed(2)}
                </span>
                <button className="text-gray-400 hover:text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      {!isEmpty && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between text-sm mb-2">
            <span>Taxes</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>$12.00</span>
          </div>
          <button className="w-full py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
