"use client";
import React, { useState } from "react";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    price: "",
    description: "",
    quantity: "",
    brand: "",
    productModel: "",
    color: "",
    category: "",
    discount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = {
      title: formData.title,
      image: formData.image,
      price: Number(formData.price),
      description: formData?.description,
      quantity: Number(formData.quantity),
      brand: formData.brand,
      productModel: formData.productModel,
      color: formData?.color,
      category: formData.category,
      discount: Number(formData.discount),
    };

    const res = await fetch("/api/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert("Product added successfully!");
      window.location.href = "/";
      // Optionally reset form here
    } else {
      alert("Error adding product.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Add New Product
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          { label: "Title", name: "title" },
          { label: "Price", name: "price", type: "number" },
          { label: "Quantity", name: "quantity", type: "number" },
          { label: "Brand", name: "brand" },
          { label: "Model", name: "productModel" },
          { label: "Color", name: "color" },
          { label: "Category", name: "category" },
          { label: "Discount (%)", name: "discount", type: "number" },
          { label: "Image URL", name: "image" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block text-gray-700 font-medium mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={`Enter ${label.toLowerCase()}`}
              required={name !== "color" && name !== "discount"}
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter product description"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
