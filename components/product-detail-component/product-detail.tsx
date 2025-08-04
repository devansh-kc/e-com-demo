"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux-slice/cart-slice";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import Link from "next/link";
import ProductDeleteDialog from "../product-delete-dialog/product-delete-dialog";

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

const ProductDetailsCard: React.FC<{
  product: ProductProps;
}> = ({ product }) => {
  const [showDeleteComponent, setShowDeleteComponent] = useState(false);
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const { isAdmin } = useSelector((state: RootState) => state?.AdminSlice);

  console.log(product);
  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

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

  return (
    <>
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
                <span className="font-semibold">Model:</span>{" "}
                {product.productModel}
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
              <p>
                <span className="font-semibold">Quantity:</span>{" "}
                <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-800 text-xs">
                  {product.quantity}
                </span>
              </p>
            </div>

            {/* Price Display */}
            <div className="flex items-end space-x-4">
              <span className="text-3xl font-extrabold text-green-600">
                {discountedPrice > 0
                  ? `₹ ${discountedPrice.toFixed(0)}`
                  : `₹ ${product.price?.toFixed(0)}`}
              </span>
              {product?.discount > 0 && (
                <>
                  <span className="text-lg line-through text-gray-400">
                    ₹{product?.price}
                  </span>
                  <span className="text-sm font-medium text-red-500">
                    -{product.discount}% OFF
                  </span>
                </>
              )}
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
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              {!isAdmin && (
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
              )}

              {isAdmin && (
                <>
                  <Link
                    target="_blank"
                    href={`/update-product/${product?.productId}`}
                    className="flex-1 py-3 rounded-lg border border-black text-black text-center hover:bg-black hover:text-white transition"
                  >
                    Update Product
                  </Link>

                  <button
                    onClick={() => setShowDeleteComponent(true)}
                    className="flex-1 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete Product
                  </button>
                </>
              )}
            </div>
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
