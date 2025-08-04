"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function UpdateProductForm({ id }: Readonly<{ id: string }>) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    price: 0,
    description: "",
    quantity: 1,
    brand: "",
    productModel: "",
    color: "",
    category: "",
    discount: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/fetch-product-data/${id}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setFormData({
            image: data.product.image || "",
            title: data.product.title || "",
            price: data.product.price || 0,
            description: data.product.description || "",
            quantity: data.product.quantity || 1,
            brand: data.product.brand || "",
            productModel: data.product.productModel || "",
            color: data.product.color || "",
            category: data.product.category || "",
            discount: data.product.discount || 0,
          });
        } else {
          alert("Failed to load product");
        }
      } catch (err) {
        alert("Error fetching product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "discount"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/update-product/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Product updated successfully");
      router.push("/");
    } else {
      alert(data?.error || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(
          ([key, value]) =>
            key !== "productId" && (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key}
                </label>
                <input
                  type={typeof value === "number" ? "number" : "text"}
                  name={key}
                  value={value ?? ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 border-gray-300 shadow-sm"
                />
              </div>
            )
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

export default UpdateProductForm;
