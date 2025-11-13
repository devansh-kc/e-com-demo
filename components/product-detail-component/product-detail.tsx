"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux-slice/cart-slice";
import ProductDeleteDialog from "../product-delete-dialog/product-delete-dialog";

type Comment = {
  _id?: string;
  userName: string;
  comment: string;
  rating?: number;
  createdAt?: string;
};

type ProductProps = {
  productId: string;
  title: string;
  brand: string;
  productModel: string;
  category: string;
  color: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  quantity: number;
};

const ProductDetailsCard: React.FC<{ product: ProductProps }> = ({
  product,
}) => {
  const [showDeleteComponent, setShowDeleteComponent] = useState(false);
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  // 🗨️ Comment Section States
  const [comments, setComments] = useState<Comment[]>([]);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  // ✅ Fetch existing comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/add-comments/${product.productId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments || []);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [product.productId]);

  // ✅ Add new comment
  const handleAddComment = async () => {
    if (!userName || !comment) return alert("Please fill in all fields");
    setLoading(true);

    try {
      const res = await fetch(`/api/add-comments/${product.productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userId: "guest", comment, rating }),
      });

      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [data.comment, ...prev]);
        setUserName("");
        setComment("");
        setRating("");
      } else {
        alert(data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.productId,
        title: product.title,
        price: discountedPrice,
        image: product.image,
        quantity: 1,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Calculate average rating
  const avgRating =
    comments.length > 0
      ? (
          comments.reduce((acc, c) => acc + (c.rating || 0), 0) /
          comments.filter((c) => c.rating).length
        ).toFixed(1)
      : null;

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Product Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-6 sm:p-10 border border-gray-100 overflow-hidden relative">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full blur-3xl opacity-30 -z-0"></div>

          {/* Product Image */}
          <div className="relative w-full h-[400px] sm:h-[500px] group">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden shadow-inner">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                {product.discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 relative z-10">
            {/* Brand Badge */}
            <div className="inline-block">
              <span className="px-4 py-1.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-xs font-semibold rounded-full tracking-wide uppercase shadow-md">
                {product.brand}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Rating Summary */}
            {avgRating && (
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 w-fit shadow-sm">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(Number(avgRating))
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{avgRating}</span>
                <span className="text-sm text-gray-500">
                  ({comments.length} reviews)
                </span>
              </div>
            )}

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Model", value: product.productModel },
                { label: "Category", value: product.category },
                { label: "Color", value: product.color },
                { label: "In Stock", value: product.quantity },
              ].map((spec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    {spec.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-end gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <span className="text-4xl font-extrabold text-green-600">
                    ₹{discountedPrice.toFixed(0)}
                  </span>
                </div>
                {product.discount > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl line-through text-gray-400">
                      ₹{product.price}
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      Save ₹{(product.price - discountedPrice).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                Product Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full py-4 rounded-2xl transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${
                added
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white hover:shadow-2xl"
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Added to Cart
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>

        {/* 🗨️ Reviews Section */}
        <div className="mt-10 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl p-6 sm:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              Customer Reviews
            </h2>
            {comments.length > 0 && (
              <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold">
                {comments.length} {comments.length === 1 ? "Review" : "Reviews"}
              </span>
            )}
          </div>

          {/* Add Review Form */}
          <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">
              Write a Review
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border-2 border-gray-200 p-3 rounded-xl w-full focus:border-blue-500 focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="border-2 border-gray-200 p-3 rounded-xl w-full focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />

              {/* Star Rating Input */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Rating:
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <span
                        className={
                          star <= (hoveredRating || rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                {rating && (
                  <span className="text-sm text-gray-600">({rating}/5)</span>
                )}
              </div>

              <button
                onClick={handleAddComment}
                disabled={loading}
                className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>

          {/* Display Reviews */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((c, idx) => (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {c.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {c.userName}
                        </p>
                        {c.createdAt && (
                          <p className="text-xs text-gray-500">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {c.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="font-bold text-gray-900">
                          {c.rating}
                        </span>
                        <span className="text-gray-500 text-sm">/5</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{c.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {showDeleteComponent && (
        <ProductDeleteDialog
          id={product.productId}
          setShowDeleteConfirm={setShowDeleteComponent}
          title={product.title}
        />
      )}
    </>
  );
};

export default ProductDetailsCard;
