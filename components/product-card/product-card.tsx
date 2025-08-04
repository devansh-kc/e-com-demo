"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux-slice/cart-slice"; // ✅ make sure this path is correct
import { RootState } from "@/store/store";
import { Trash2 } from "lucide-react";
import ProductDeleteDialog from "../product-delete-dialog/product-delete-dialog";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  description?: string;
  productId: string;
  quantity: number;
  brand: string;
  productModel: string;
  color?: string;
  category: string;
  discount?: number;
}

export function ProductCard({
  productData,
}: Readonly<{
  productData: ProductCardProps;
}>) {
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { isAdmin } = useSelector((state: RootState) => state?.AdminSlice);
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: productData?.productId,
        title: productData?.title,
        price: productData?.price,
        image: productData?.image,
        quantity: 1,
      })
    );
  };

  return (
    <>
      <article className="bg-white shadow-md rounded-xl overflow-hidden transition-transform hover:scale-105 duration-300">
        <figure className="relative">
          <Image
            src={productData?.image}
            alt={productData?.title}
            width={300}
            height={300}
            className="w-full h-64 object-contain bg-gray-50"
          />

          {isAdmin && (
            <button
              onClick={() => setShowDeleteConfirm(true)} // <== ✅ ADD THIS
              className="absolute top-2 right-2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition"
              aria-label="Delete Product"
            >
              <Trash2 />
            </button>
          )}
        </figure>

        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold truncate">
            {productData?.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2">
            {productData?.description || "A great product just for you!"}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">
              ₹{Number(productData?.price)}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Link
              href={`/${productData?.productId}`}
              className="flex-1 text-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              View Details
            </Link>

            {isAdmin ? (
              <Link
                href={`/update-product/${productData?.productId}`}
                target="_blank"
                className="flex-1 text-center bg-white text-black border hover:bg-white hover:text-black px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Update product
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border border-black text-black hover:bg-black hover:text-white transition px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </article>
      {showDeleteConfirm && (
        <ProductDeleteDialog
          setShowDeleteConfirm={setShowDeleteConfirm}
          title={productData?.title}
          id={productData?.productId}
        />
      )}
    </>
  );
}

export default ProductCard;
