"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Product {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ShippingDetails {
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  id: string;
  email: string;
  products: Product[];
  totalAmount: number;
  shippingDetails: ShippingDetails;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSpent: number;
}

interface UserSummary {
  user: User;
  orderStats: OrderStats;
  orders: Order[];
}

export default function Dashboard() {
  const router = useRouter();
  const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserSummary();
  }, []);

  const fetchUserSummary = async () => {
    try {
      const response = await fetch("/api/user-summary", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUserSummary(data);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to load user data");
        if (response.status === 401) {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Error fetching user summary:", error);
      setError("An error occurred while loading your data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userSummary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{userSummary.user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{userSummary.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">
                {userSummary.user.address}
                {userSummary.user.apartment &&
                  `, ${userSummary.user.apartment}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">City, State</p>
              <p className="font-medium">
                {userSummary.user.city}, {userSummary.user.state} -{" "}
                {userSummary.user.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold">
              {userSummary.orderStats.totalOrders}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {userSummary.orderStats.deliveredOrders}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">
              {userSummary.orderStats.shippedOrders}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {userSummary.orderStats.pendingOrders}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 col-span-2 sm:col-span-1">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-2xl font-bold">
              {formatCurrency(userSummary.orderStats.totalSpent)}
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order History</h2>

          {userSummary.orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-sm mt-1">
                Start shopping to see your orders here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {userSummary.orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-lg">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Ordered on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      Products:
                    </p>
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-start sm:items-center gap-3 bg-gray-50 p-3 rounded-lg"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Quantity: {product.quantity} ×{" "}
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-sm sm:text-base">
                            {formatCurrency(product.price * product.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Details */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Shipping Address:
                    </p>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">
                        {order.shippingDetails.fullName}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.shippingDetails.address}
                      {order.shippingDetails.apartment &&
                        `, ${order.shippingDetails.apartment}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingDetails.city},{" "}
                      {order.shippingDetails.state} -{" "}
                      {order.shippingDetails.pincode}
                    </p>
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200 gap-2">
                    <div className="text-sm text-gray-600">
                      {order.products.length} item
                      {order.products.length !== 1 ? "s" : ""}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="text-xl font-bold">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
