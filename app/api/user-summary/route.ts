import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/connection";
import UserModel from "@/models/userInformationmodel/user-informationn-model";
import OrderModel, {
  ProductItem,
} from "@/models/OrderInformation/order-information-model"; // Your existing Order model

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

interface JWTPayload {
  userId: string;
  email: string;
}

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

    // Get user details
    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get user's orders using their email (since your Order schema uses email)
    const orders = await OrderModel.find({ email: user.email })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 orders

    // Calculate order statistics
    const orderStats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === "pending")
        .length,
      shippedOrders: orders.filter((order) => order.status === "shipped")
        .length,
      deliveredOrders: orders.filter((order) => order.status === "delivered")
        .length,
      cancelledOrders: orders.filter((order) => order.status === "cancelled")
        .length,
      totalSpent: orders
        .filter((order) => order.status !== "cancelled")
        .reduce((sum, order) => sum + order.totalAmount, 0),
    };

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      email: order.email,
      products: order.products.map((product: ProductItem) => ({
        productId: product.productId,
        title: product.title,
        quantity: product.quantity,
        price: product.price,
        image: product.image,
      })),
      totalAmount: order.totalAmount,
      shippingDetails: {
        firstName: order.shippingDetails.firstName,
        lastName: order.shippingDetails.lastName,
        fullName: `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`,
        address: order.shippingDetails.address,
        apartment: order.shippingDetails.apartment,
        city: order.shippingDetails.city,
        state: order.shippingDetails.state,
        pincode: order.shippingDetails.pincode,
      },
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    // Prepare user summary
    const userSummary = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        address: user.address,
        apartment: user.apartment,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      orderStats,
      orders: formattedOrders,
    };

    return NextResponse.json(userSummary, { status: 200 });
  } catch (error) {
    console.error("User summary error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
