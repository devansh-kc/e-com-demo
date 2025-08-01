"use client";

import Image from "next/image";
import { X, Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementItem,
  decrementItem,
  removeFromCart,
} from "@/redux-slice/cart-slice";
import { RootState } from "@/store/store";
import Link from "next/link";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
}: Readonly<CartSidebarProps>) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.CartSlice.items);
  const isEmpty = cartItems.length === 0;
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 w-[90%] sm:w-[400px] h-full bg-white text-black z-50 shadow-2xl rounded-l-xl transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold tracking-wide">Your Cart</h2>
        <button onClick={onClose} className="hover:text-red-500 transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col h-[calc(100%-80px)]">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <ShoppingCart size={50} />
              <p className="mt-4 font-semibold">Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg shadow border"
              >
                <Image
                  src={item?.image}
                  alt={item.title}
                  width={50}
                  height={50}
                  className="rounded object-contain bg-white"
                  onError={(event) =>
                    (event.currentTarget.srcset = "/download.png")
                  }
                />
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-1">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border rounded-full px-2 py-1 text-sm gap-2 bg-white shadow-sm">
                      <button
                        onClick={() => dispatch(decrementItem(item.id))}
                        className="hover:text-red-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(incrementItem(item.id))}
                        className="hover:text-green-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500 transition"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="p-4 border-t border-gray-200 bg-white shadow-md sticky bottom-0">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Taxes</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Link
              onClick={onClose}
              href="/checkout"
              className="block text-center w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition duration-300"
            >
              Proceed to Checkout
            </Link>{" "}
          </div>
        )}
      </div>
    </div>
  );
}
