"use client";

import ProductCard from "@/components/product-card/product-card";
import ProductCardSkeleton from "@/components/product-card/skeleton/product-card-skeleton";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [limit, setLimit] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://fakestoreapi.in/api/products?limit=${limit}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const { products: newProducts } = await res.json();

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filtered = (newProducts ?? []).filter(
          (item: Product) => !existingIds.has(item.id)
        );

        // If no new products, stop further loading
        if (filtered.length === 0) {
          setHasMore(false);
        }

        return [...prev, ...filtered];
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [limit]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setLimit((prev) => prev + 12);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            id={product.id.toString()}
          />
        ))}

        {loading && <ProductCardSkeleton />}
      </div>

      {error && <div className="text-red-600 text-center mt-4">{error}</div>}

      <div className="flex justify-center mt-6">
        {hasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={`px-4 py-2 rounded transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-black hover:bg-gray-800 text-white"
            }`}
          >
            {loading ? "Loading..." : "Load More Products"}
          </button>
        ) : (
          <p className="text-gray-600">No more products to load.</p>
        )}
      </div>
    </div>
  );
}
