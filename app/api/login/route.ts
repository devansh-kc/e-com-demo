import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/connection";
import UserModel from "@/models/userInformationmodel/user-informationn-model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d", // Token expires in 7 days
      },
    );

    // Prepare user data (excluding password)
    const userData = {
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

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userData,
        token,
      },
      { status: 200 },
    );

    // Set HTTP-only cookie with the token
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
