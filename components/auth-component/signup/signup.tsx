"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Indian states list
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Name validation
    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Address validation
    if (formData.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address";
    }

    // City validation
    if (formData.city.trim().length < 2) {
      newErrors.city = "Please enter a valid city name";
    }

    // State validation
    if (!formData.state) {
      newErrors.state = "Please select a state";
    }

    // Pincode validation (Indian pincode format: 6 digits)
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful signup
        console.log("Signup successful:", data);
        // Redirect to login or dashboard
        router.push("/");
      } else {
        // Handle error from API
        setErrors({ api: data.message || "Signup failed. Please try again." });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ api: "An error occurred. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        {errors.api && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Street address, building number"
              value={formData.address}
              onChange={handleChange}
              required
              autoComplete="street-address"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Apartment (Optional) */}
          <div>
            <label
              htmlFor="apartment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Apartment, Suite, etc.{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              id="apartment"
              name="apartment"
              type="text"
              placeholder="Apt 4B, Floor 2"
              value={formData.apartment}
              onChange={handleChange}
              autoComplete="off"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Mumbai"
                value={formData.city}
                onChange={handleChange}
                required
                autoComplete="address-level2"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                autoComplete="address-level1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              placeholder="400001"
              value={formData.pincode}
              onChange={handleChange}
              required
              maxLength={6}
              autoComplete="postal-code"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                errors.pincode ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
