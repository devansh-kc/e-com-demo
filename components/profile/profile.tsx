"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  MapPin,
  Building2,
  Phone,
  Lock,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
}

export default function EditProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileEmail, setProfileEmail] = useState("");

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          address: data.user.address,
          apartment: data.user.apartment || "",
          city: data.user.city,
          state: data.user.state,
          pincode: data.user.pincode,
        });
        setProfileEmail(data.user.email);
      } else {
        if (response.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to load profile");
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("An error occurred while loading your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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

    // Pincode validation
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    // Password validation (only if user is trying to change password)
    if (
      passwordData.currentPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      if (!passwordData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      if (!passwordData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (passwordData.newPassword.length < 8) {
        newErrors.newPassword = "New password must be at least 8 characters";
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const payload: any = { ...formData };

      // Only include password fields if user is changing password
      if (passwordData.currentPassword && passwordData.newPassword) {
        payload.currentPassword = passwordData.currentPassword;
        payload.newPassword = passwordData.newPassword;
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(data.user));

        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">
            Update your personal information and password
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={20} className="flex-shrink-0" />
            <p className="font-medium">Profile updated successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Information
            </h2>

            <div className="space-y-4">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={profileEmail}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              Address Details
            </h2>

            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Apartment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, Suite, etc.{" "}
                  <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="apartment"
                    type="text"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none"
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                      errors.pincode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.pincode && (
                  <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Change Password (Optional) */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Lock size={20} className="text-blue-600" />
              Change Password
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Leave blank if you don't want to change your password
            </p>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                      errors.currentPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:outline-none ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
