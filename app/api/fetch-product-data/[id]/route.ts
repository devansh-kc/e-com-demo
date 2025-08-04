import { dbConnect } from "@/lib/connection";
import ProductDataModel from "@/models/cartItemModel/cart-item-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: Readonly<{ params: Promise<{ id: string }> }>
) {
  await dbConnect();

  const { id } = await params;
  try {
    const product = await ProductDataModel.findOne({ productId: id });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
