import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/connection";
import UserModel from "@/models/userInformationmodel/user-informationn-model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

interface JWTPayload {
  userId: string;
  email: string;
}

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from cookie or Authorization header
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Get user details (excluding password)
    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          apartment: user.apartment,
          city: user.city,
          state: user.state,
          pincode: user.pincode,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from cookie or Authorization header
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      address,
      apartment,
      city,
      state,
      pincode,
      currentPassword,
      newPassword,
    } = body;

    // Find user
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validate required fields
    if (!firstName || !lastName || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 },
      );
    }

    // If user wants to change password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Current password is required to set a new password" },
          { status: 400 },
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 401 },
        );
      }

      // Validate new password strength
      if (newPassword.length < 8) {
        return NextResponse.json(
          { message: "New password must be at least 8 characters long" },
          { status: 400 },
        );
      }

      // Hash new password
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.address = address;
    user.apartment = apartment || "";
    user.city = city;
    user.state = state;
    user.pincode = pincode;

    // Save updated user
    await user.save();

    // Prepare updated user data (excluding password)
    const updatedUser = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      apartment: user.apartment,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
    };

    // Update localStorage user data
    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
