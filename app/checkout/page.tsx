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
  const cartItems = useSelector((state: RootState) => state.CartSlice.items); // Adjust based on your slice structure

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
        throw new Error(data.error || "Failed to place order");
      }

      toast.success("Order placed successfully!");
      dispatch(clearCart());
      router.push("/"); // redirect to homepage or thank you page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
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
          className="w-full p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" />
          <span>Email me with news and offers</span>
        </label>

        <h2 className="text-2xl font-bold">Shipping address</h2>

        <select
          className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-700"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
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
            className="w-1/2 p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last name"
            className="w-1/2 p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <input
          type="text"
          placeholder="Address"
          className="w-full p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="Apartment, building, etc. (optional)"
          className="w-full p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500"
          value={form.apartment}
          onChange={(e) => setForm({ ...form, apartment: e.target.value })}
        />

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="City"
            className="w-1/3 p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <select
            className="w-1/3 p-3 rounded-md bg-white border border-gray-300 text-gray-700"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
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
            className="w-1/3 p-3 rounded-md bg-white border border-gray-300 placeholder-gray-500"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />
        </div>

        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" />
          <span>Save this information for next time</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
        >
          Continue to shipping
        </button>
      </form>
    </div>
  );
}
