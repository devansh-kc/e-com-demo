import React from "react";

function ProductCardSkeleton() {
  const numberOfSkeletons = 12;

  return (
    <>
      {Array.from({ length: numberOfSkeletons }).map((_, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="w-full h-64 bg-gray-200" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-2">
            {/* Title */}
            <div className="h-5 bg-gray-300 rounded w-3/4" />

            {/* Description */}
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />

            {/* Price + Button Skeleton */}
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-gray-300 rounded w-16" />
              <div className="h-8 bg-gray-400 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductCardSkeleton;
