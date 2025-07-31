import React from "react";

const ProductCardSkeleton = () => {
  const numberOfSkeletons = 12;

  return (
    <>
      {Array.from({ length: numberOfSkeletons }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="aspect-[4/3] bg-gray-200 w-full" />

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-5 bg-gray-300 rounded w-3/4" />

            {/* Description lines */}
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />

            {/* Price and Button */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-16 bg-gray-300 rounded" />
              <div className="h-8 w-20 bg-gray-400 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCardSkeleton;
