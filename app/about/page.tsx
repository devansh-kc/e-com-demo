"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          About Acme Electronic Hub
        </h1>

        <p className="text-lg leading-relaxed">
          Welcome to <strong>Acme Electronic Hub</strong> – your one-stop
          destination for premium electronic gadgets at unbeatable prices.
          Whether you&apos;re a tech enthusiast or a casual buyer, we’re here to
          bring you the latest and greatest in electronics, right to your
          doorstep.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to make high-quality electronic products accessible
              and affordable for everyone. We’re committed to delivering a
              seamless shopping experience powered by modern technology.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Curated product selection</li>
              <li>Fast and reliable shipping</li>
              <li>Secure checkout process</li>
              <li>Responsive customer support</li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Next.js & React</li>
            <li>Tailwind CSS for styling</li>
            <li>Redux Toolkit for cart management</li>
            <li>FakeStore API (for mock product data)</li>
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
