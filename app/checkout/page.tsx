"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "@/store/store";
import { clearCart } from "@/redux-slice/cart-slice";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.CartSlice.items);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  // 🔁 Redirect to homepage if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      router.replace("/");
    }
  }, [cartItems, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          products: cartItems?.map((cart) => ({
            productId: cart?.id,
            quantity: cart.quantity,
          })),
          shippingDetails: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      toast.success("Order placed successfully!");
      dispatch(clearCart());
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      setIsLoading(false); // Re-enable form on error
    }
    // Note: We don't set isLoading to false on success because we're navigating away
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold">Contact</h2>

        <input
          type="text"
          placeholder="Email or mobile number"
          className="w-full p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={isLoading}
          required
        />

        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" disabled={isLoading} />
          <span className={isLoading ? "opacity-50" : ""}>
            Email me with news and offers
          </span>
        </label>

        <h2 className="text-2xl font-bold">Shipping address</h2>

        <select
          className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          disabled={isLoading}
        >
          <option>Maharashtra</option>
          <option>Gujarat</option>
          <option>Rajasthan</option>
          <option>Delhi</option>
          <option>Karnataka</option>
          <option>Tamil Nadu</option>
          <option>Uttar Pradesh</option>
          <option>West Bengal</option>
          <option>Madhya Pradesh</option>
          <option>Other</option>
        </select>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="First name"
            className="w-1/2 p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            disabled={isLoading}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            className="w-1/2 p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>

        <input
          type="text"
          placeholder="Address"
          className="w-full p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          disabled={isLoading}
          required
        />
        <input
          type="text"
          placeholder="Apartment, building, etc. (optional)"
          className="w-full p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          value={form.apartment}
          onChange={(e) => setForm({ ...form, apartment: e.target.value })}
          disabled={isLoading}
        />

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="City"
            className="w-1/3 p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            disabled={isLoading}
            required
          />
          <select
            className="w-1/3 p-3 rounded-md bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            disabled={isLoading}
          >
            <option>Maharashtra</option>
            <option>Gujarat</option>
            <option>Rajasthan</option>
            <option>Delhi</option>
            <option>Karnataka</option>
            <option>Tamil Nadu</option>
            <option>Uttar Pradesh</option>
            <option>West Bengal</option>
            <option>Madhya Pradesh</option>
            <option>Other</option>
          </select>
          <input
            type="text"
            placeholder="Pincode"
            className="w-1/3 p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>

        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" disabled={isLoading} />
          <span className={isLoading ? "opacity-50" : ""}>
            Save this information for next time
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Continue to shipping"
          )}
        </button>
      </form>
    </div>
  );
}
