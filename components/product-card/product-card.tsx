import Image from "next/image";
import Link from "next/link"; // ✅ use Next.js Link
import React from "react";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  description?: string;
  id: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  description,
  id,
}) => {
  return (
    <article className="bg-white shadow-md rounded-xl overflow-hidden transition-transform hover:scale-105 duration-300">
      <figure>
        <Image
          src={image}
          alt={title}
          width={300}
          height={300}
          className="w-full h-64 object-contain bg-gray-50"
        />
      </figure>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          {description || "A great product just for you!"}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">${price}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <Link
            href={`/${id}`}
            className="flex-1 text-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            View Details
          </Link>
          <button className="flex-1 bg-white border border-black text-black hover:bg-black hover:text-white transition px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
