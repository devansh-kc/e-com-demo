"use client";

import React from "react";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4">
      <FaBoxOpen className="text-6xl text-gray-400 mb-4" />
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        Product Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        Sorry, we couldn&lsquo;t find the product you&lsquo;re looking for. It
        may have been removed or never existed.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
