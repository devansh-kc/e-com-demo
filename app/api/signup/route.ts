import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/connection"; // Adjust path as needed
import UserModel from "@/models/userInformationmodel/user-informationn-model"; // Adjust path as needed

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      address,
      apartment,
      city,
      state,
      pincode,
      password,
    } = body;

    // Validate required fields
    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !password
    ) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      firstName,
      lastName,
      address,
      apartment: apartment || undefined,
      city,
      state,
      pincode,
      password: hashedPassword,
    });

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      address: newUser.address,
      apartment: newUser.apartment,
      city: newUser.city,
      state: newUser.state,
      pincode: newUser.pincode,
    };

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
