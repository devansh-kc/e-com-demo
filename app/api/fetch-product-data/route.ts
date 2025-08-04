import { dbConnect } from "@/lib/connection";
import ProductDataModel from "@/models/cartItemModel/cart-item-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = 12;
  try {
    const products = await ProductDataModel.find().skip(offset).limit(limit);

    return NextResponse.json({
      data: products,
      offset,
      limit,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
