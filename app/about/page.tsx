"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          About Our E-Commerce Platform
        </h1>

        <p className="text-lg leading-relaxed">
          Welcome to our modern e-commerce platform — your trusted destination
          for a seamless online shopping experience. Whether you&apos;re here to
          explore high-quality products or manage orders as an admin, our
          application is built to deliver speed, efficiency, and reliability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              We aim to provide a dynamic and scalable shopping experience by
              leveraging modern technologies like Next.js, MongoDB, and Redux.
              From browsing products to completing secure checkouts, we focus on
              delivering a hassle-free experience to our users.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Product listings with dynamic filtering and search</li>
              <li>Cart management with Redux Toolkit</li>
              <li>Secure checkout with real-time inventory updates</li>
              <li>Admin dashboard for order management</li>
              <li>Dispatch and cancel shipment functionality</li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Next.js & React for frontend</li>
            <li>Tailwind CSS for styling</li>
            <li>Redux Toolkit for state management</li>
            <li>MongoDB with Mongoose for database modeling</li>
            <li>Next.js API routes for backend integration</li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
