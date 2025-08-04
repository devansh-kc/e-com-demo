"use client";

import React, { useEffect, useState } from "react";

interface Product {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;
  email: string;
  products: Product[];
  shippingDetails: ShippingDetails;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/get-order-details");
      const data = await res.json();
      setOrders(data.orders);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/update-order-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : order.status === "shipped"
                      ? "bg-blue-200 text-blue-800"
                      : order.status === "delivered"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-sm mb-2">📧 {order.email}</p>

              <div className="mb-4">
                <h3 className="font-medium">Products:</h3>
                <ul className="list-disc pl-6 text-sm">
                  {order.products.map((product, index) => (
                    <li key={index}>
                      {product.title} (x{product.quantity}) — ₹
                      {product.price * product.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm mb-2">
                🏠{" "}
                {`${order.shippingDetails.firstName} ${
                  order.shippingDetails.lastName
                }, ${order.shippingDetails.address}, ${
                  order.shippingDetails.apartment || ""
                }, ${order.shippingDetails.city}, ${
                  order.shippingDetails.state
                } - ${order.shippingDetails.pincode}`}
              </div>

              <p className="font-semibold text-right">
                💰 ₹{order.totalAmount}
              </p>
              <p className="text-xs text-gray-500 text-right">
                ⏰ {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => updateStatus(order._id, "shipped")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  disabled={
                    order.status === "shipped" || order.status === "cancelled"
                  }
                >
                  Dispatch Shipment
                </button>
                <button
                  onClick={() => updateStatus(order._id, "cancelled")}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  disabled={
                    order.status === "cancelled" || order.status === "delivered"
                  }
                >
                  Cancel Shipment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
