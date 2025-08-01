"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux-slice/cart-slice";

type ProductProps = {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  description: string;
  price: number;
  discount: number;
  image: string;
};

const ProductDetailsCard: React.FC<{ product: ProductProps }> = ({
  product,
}) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: discountedPrice,
        image: product.image,
        quantity: 1,
      })
    );
    setAdded(true);

    // Optional: revert back to "Add to Cart" after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start bg-white shadow-xl rounded-2xl p-8">
        {/* Product Image */}
        <div className="relative w-full h-[450px]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain rounded-xl bg-gray-100"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 leading-snug">
            {product.title}
          </h1>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
            <p>
              <span className="font-semibold">Model:</span> {product.model}
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
            <p>
              <span className="font-semibold">Color:</span>{" "}
              <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-800 text-xs">
                {product.color}
              </span>
            </p>
          </div>

          {/* Price Display */}
          <div className="flex items-end space-x-4">
            <span className="text-3xl font-extrabold text-green-600">
              ₹{discountedPrice.toFixed(0)}
            </span>
            <span className="text-lg line-through text-gray-400">
              ₹{product.price}
            </span>
            <span className="text-sm font-medium text-red-500">
              -{product.discount}% OFF
            </span>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-semibold text-lg mb-1 text-gray-800">
              Description
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex-1 py-3 rounded-lg transition text-white ${
                added
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-black to-gray-900 hover:from-gray-800 hover:to-black"
              }`}
            >
              {added ? "Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsCard;
